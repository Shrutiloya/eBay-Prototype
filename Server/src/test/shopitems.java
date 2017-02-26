package test;


import javax.jws.WebService;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;
import pojo.*;

@WebService
public class shopitems {

	@SuppressWarnings("null")
	public Items[] getitems(String username) {
		
		Items[] items = new Items[10];
	
		DBServices db = new DBServices();
		DBCollection table = db.getCollection("products");
			
			int count =0 ;
			
			
			
			BasicDBObject searchQuery = new BasicDBObject();
			searchQuery.put("username",  new BasicDBObject("$ne",username));
			DBCursor cursor = table.find(searchQuery);
			
			System.out.println("**COUNT***"+cursor.count());
		
			
			while (cursor.hasNext())
			{
				System.out.println("***RESULT1122");
				BasicDBObject obj = (BasicDBObject) cursor.next();
				
				items[count]= new Items();
				items[count].setItemname((String)obj.get("itemname"));
				items[count].setItemdesc((String)obj.get("itemdesc"));
				items[count].setUsername((String)obj.get("username"));
				items[count].setSellerinfo(obj.getString("sellerinfo"));
				items[count].setImage(obj.getString("image"));
				items[count].setPrice(obj.getString("price"));
				items[count].setQuantity(obj.getString("quantity"));
				items[count].setIsBid(obj.getString("isBid"));
				count++;
				
				
			}
			return items;
			
	
		
	}
}
