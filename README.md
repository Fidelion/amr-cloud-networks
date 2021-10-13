# amr-cloud-networks
AMR Cloud Networks (Aruba - Meraki - Ruckus)

This monitoring software toolkit allows you to easily monitor your Aruba, Meraki and Ruckus cloud networks.
Simply call REST API paths and gather any necessary information about the network status of your devices.

All of the these 3 cloud networks data points are gathered then storred within MongoDB. 

If you've ever tried to integrate these cloud monitoring tools you understand difficulty of saving and querying
their data. 

One of the biggest issue with these networks is the price you'd need to pay for WebSocket integration.

Their limitation is around 1000 data points per call. 

AMR solves the issue by making these calls in the backend until all of data is fetched.

It will go through all the pages and fetch all data by simply calling one route from the REST API path.

Make sure to go through your AMR Dashboard (Aruba or Meraki have their dashboard where you can access the keys).

You'll need your Client ID and so on in order to connect to the services.

Make sure to know number of pages you need to query through and number of your data points.

All of the endpoints of data models are listed within mongo model files.

Another issue this software solves is scalability of workers execution, simply enable pm2 module and run all 
the tasks in parallel.

This project also has a profile jwt implementation integrating github app too so it allows you to build 
SaaS solution for your client or your own startup.

If you need Docker - Kubernetes - Skaffold Microservice app reach out for help.
