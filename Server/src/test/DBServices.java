package test;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

public class DBServices
{
	DB db;
	MongoClient mongoClient;
	
	public DBServices()
	{
		mongoClient = new MongoClient("localhost", 27017);
		db = mongoClient.getDB("ebay");
		
	}

	public DBCollection getCollection(String string) 
	{
		return db.getCollection(string);
		
	}

}
