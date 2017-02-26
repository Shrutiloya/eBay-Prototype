package test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Vector;

import com.mongodb.MongoClient;

public class ConnectionPoolManager {
	
	String databaseUrl = "mongodb://localhost:27017/ebay";

	Vector<Connection> connectionPool = new Vector<Connection>();
	

	public ConnectionPoolManager()
	{
		initialize();
	}

	private void initialize()
	{
		
		while(!checkIfConnectionPoolIsFull())
		{
			System.out.println("Connection Pool is NOT full. Proceeding with adding new connections");
			//Adding new connection instance until the pool is full
			connectionPool.addElement(createNewConnectionForPool());
		}
		System.out.println("Connection Pool is full.");
	}

	private synchronized boolean checkIfConnectionPoolIsFull()
	{
		final int MAX_POOL_SIZE = 100;

		//Check if the pool size
		if(connectionPool.size() < MAX_POOL_SIZE)
		{
			return false;
		}

		return true;
	}


	private Connection createNewConnectionForPool()
	{
		Connection connection = null;

		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			connection =  (Connection) new MongoClient("localhost", 27017);
			System.out.println("Connection: "+connection);
		}
		
		catch(ClassNotFoundException cnfe)
		{
			System.err.println("ClassNotFoundException: "+cnfe);
			return null;
		}

		return connection;
	}

	public synchronized Connection getConnectionFromPool()
	{
		Connection connection = null;

		//Check if there is a connection available. There are times when all the connections in the pool may be used up
		if(connectionPool.size() > 0)
		{
			connection = (Connection) connectionPool.firstElement();
			connectionPool.removeElementAt(0);
		}
		//Giving away the connection from the connection pool
		return connection;
	}

	public synchronized void returnConnectionToPool(Connection connection)
	{
		//Adding the connection from the client back to the connection pool
		connectionPool.addElement(connection);
	}
}
