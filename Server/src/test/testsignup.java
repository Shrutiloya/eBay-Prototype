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
public class testsignup {

	public int signup(String username, String password, String firstname, String lastname) {
		
		try {
			DBServices db = new DBServices();
			DBCollection table = db.getCollection("users");
			DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy',' HH:mm:ss a");
			Calendar cal = Calendar.getInstance();
			System.out.println(dateFormat.format(cal.getTime()));
			BasicDBObject input = new BasicDBObject();
			input.put("username", username);
			input.put("password", password);
			input.put("firstname", firstname);
			input.put("lastname", lastname);
			input.put("lastlogin", dateFormat.format(cal.getTime()));
			
			
			
			System.out.println(input);

			table.insert(input);
			int code = 200;
			return code;
		} catch (MongoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 404;

		
	}
}
