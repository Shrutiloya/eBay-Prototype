package test;

import javax.jws.WebService;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@WebService
public class savePost
{

	public int savepost(String username, String itemname, String itemdesc, String sellerinfo, String price, String quantity,String isBid,String image) 
	{
		try 
		{
			DBServices db = new DBServices();
			DBCollection table = db.getCollection("products");
			BasicDBObject input = new BasicDBObject();
			input.put("username", username);
			input.put("itemname", itemname);
			input.put("itemdesc", itemdesc);
			input.put("sellerinfo", sellerinfo);
			input.put("price",price);
			input.put("quantity",quantity);
			input.put("isBid",isBid);
			input.put("image",image);
			
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
