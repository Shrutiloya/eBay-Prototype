package test;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.jws.WebService;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import pojo.*;
@WebService
public class testlogin 
{

	public User validate(String username, String password) 
	{
		
		try {
			DBServices db = new DBServices();
			DBCollection table = db.getCollection("users");
			User user = new User();
			BasicDBObject searchQuery = new BasicDBObject();
			searchQuery.put("username", username);
			searchQuery.put("password", password);
			System.out.println(searchQuery);

			DBCursor cursor = table.find(searchQuery);
			if (cursor.hasNext()) 
			{
					  BasicDBObject obj = (BasicDBObject) cursor.next();
				System.out.println(obj.getString("firstname"));
				user.setFirstName(obj.getString("firstname"));
				user.setLastLoggedIn(obj.getString("lastlogin"));
				user.setUsername(obj.getString("username"));
				
				updatelastlogin(username);
				
				
				
				return user;
			}
			System.out.println("Not Logged in");
		} catch (MongoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;
	}

	private void updatelastlogin(String username)
	{
		DBServices db = new DBServices();
		DBCollection table = db.getCollection("users");

		BasicDBObject newDocument = new BasicDBObject();
		
		DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy',' HH:mm:ss a");
		Calendar cal = Calendar.getInstance();
		
		newDocument.append("$set", new BasicDBObject().append("lastlogin", dateFormat.format(cal.getTime())));

		BasicDBObject searchQuery = new BasicDBObject().append("username", username);
		System.out.println(searchQuery);
		
		table.update(searchQuery, newDocument);
		
		
	}
}
