package test;

import javax.jws.WebService;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@WebService
public class submitBid 
{
	public int submitOffer(String username, String productid, String bidDate, String bidAmount)
	{
		try 
		{
			DBServices db = new DBServices();
			DBCollection table = db.getCollection("bidding");
			BasicDBObject input = new BasicDBObject();
			input.put("username", username);
			input.put("productId", productid);
			input.put("bidDate", bidDate);
			input.put("bidAmount", bidAmount);
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
