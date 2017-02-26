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
public class registerprofile {

	public int saveprofile(String username, String birthdate, String phoneno, String address, String ebayhandle) {
			try 
			{
				DBServices db = new DBServices();
				DBCollection table = db.getCollection("userprofile");
				BasicDBObject input = new BasicDBObject();
				input.put("username", username);
				input.put("birthdate", birthdate);
				input.put("phoneno", phoneno);
				input.put("address", address);
				input.put("ebayhandle",ebayhandle);
			
				table.save(input);
				
				int code = 200;
				return code;
		} catch (MongoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 404;

		
	}
}
