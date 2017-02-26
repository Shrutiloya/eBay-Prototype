package test;

import java.util.ArrayList;
import java.util.List;

import javax.jws.WebService;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;

import pojo.Items;

@WebService
public class userItemTransaction 
{

	DBServices db = new DBServices();
	public int checkout(String username, String[] productIds)
	{
		try 
		{
			DBCollection table = db.getCollection("purschase");
			BasicDBObject input = new BasicDBObject();
			for(int i=0;i<productIds.length;i++)
			{
				input.put("username", username);
				input.put("productId", productIds[i]);
				table.save(input);
			}
			
			
			int code = 200;
			return code;
		}
		catch (MongoException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 404;
	}
	
	
	public Items[] getMyCollection(String username)
	{
		
		Items[] items = new Items[10];
	
			
			DBCollection table = db.getCollection("products");
			
			int count =0 ;
			
			
			
			BasicDBObject searchQuery = new BasicDBObject();
			searchQuery.put("username", username);
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
	
	public Items[] getMyBoughtItems(String[] itemids)
	{
		
		Items[] items = new Items[10];
	
			DBCollection table = db.getCollection("products");
			
			int count =0 ;
			
			
			List<String> list = new ArrayList<String>();
			for(int i=0;i<=itemids.length;i++)
			{
				list.add(itemids[i]);
			}
			
			BasicDBObject searchQuery = new BasicDBObject();
			searchQuery.put("_id", new BasicDBObject("$in", list));
			DBCursor cursor = table.find(searchQuery);
			
			System.out.println("**COUNT***"+cursor.count());
		
			
			while (cursor.hasNext())
			{
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
