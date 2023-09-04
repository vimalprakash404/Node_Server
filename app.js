// in the index.js file
require('dotenv').config()
const express = require('express')
const app = express()
const port =  process.env.PORT ||5054
const Gun = require('gun')
const mongoose = require('mongoose');
const http = require('http');
const index="init1234"
const server = app.listen(port, () => {
  console.log(`Gun server running on port ${port}🔥`)
})
mongoose.connect('mongodb://192.168.1.126:27017/Sample', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const YourModel = mongoose.model('Data', {
  _id: String,
  Email: String,
  Institution: String,
  Name: String,
  Phone: String,
  Verified: Boolean
});
const gun =Gun({  web: server, radisk: true, localStorage:  true });

function uploadall_data()
{
  for (let i=1;i<=3000;i++)
    {
      gun.get(index+'/'+pad(i,3)).on((node) => { 
        console.log(node)
        const newData = new YourModel({
          _id:pad(i,3),
          Email: node.Email,
          Institution: node.Institution,
          Name:node.Name,
          Phone : node.Phone,
          Verified : node.Verified
        });
        YourModel.findOne(newData)
        .then((existingData) => {
          if (existingData) {
            console.log('Data already exists in MongoDB:', existingData);
          } else {
            // Data does not exist, insert it into MongoDB and Gun.js
            const document = new YourModel(newData);

            document.save()
              .then((savedDocument) => {
                console.log('Data saved to Mongoose:', savedDocument);

                // Now, you can also store the data in Gun.js if needed
                
              })
              .catch((error) => {
                console.error('Error saving data to Mongoose:', error);
              });
          }
        })
        .catch((error) => {
          console.error('Error checking for existing data in MongoDB:', error);
        });

    })
    
    }
}

app.use(Gun.serve)
app.get('/hello',(req, res)=>
{
  const data_set ={ 'data' : "vimal" }
  res.send(data_set)
  uploadall_data();
 
})

app.get('/getdata',(req, res)=>
{
  getAllData()
  .then((data) => {
    res.send(data)
  })
  .catch((error) => {
    // Handle any errors that occur during retrieval
  });
})

app.get('/update',(req, res)=>
{
  node_listner()
})


gun.get("init123").on((node) => { 
  console.log("data is here")
   node 
})
  

function pad(n, length) {
  var len = length - (''+n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}



// Function to update data in MongoDB
async function updateData(query, newData) {
  try {
    const updatedData = await YourModel.findOneAndUpdate(
      query, // The query to find the document to update
      { $set: newData }, // The new data to set
      { new: true } // Return the updated document
    );

    if (updatedData) {
      console.log('Data updated successfully:', updatedData);
      return updatedData;
    } else {
      console.log('No matching document found for the update query.');
      return null;
    }
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}



async function getAllData() {
  try {
    const allData = await YourModel.find();

    if (allData.length > 0) {
      console.log('All data retrieved successfully:', allData);
      return allData;
    } else {
      console.log('No data found in the collection.');
      return [];
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
}


function updateuser(user_id, verified_status)
{
  const query = { _id: user_id }; 
const newData = { Verified: verified_status }; 

updateData(query, newData)
  .then((updatedData) => {
    console.log((updatedData))
  })
  .catch((error) => {
    console.log(error)
  });
}



function node_listner()
{
  for (let i=1;i<=3000;i++)
      {
        gun.get(index+'/'+pad(i,3)).on((node) => { 
          
            if(node.Verified)
            { 
              console.log(pad(i,3)+"ghyghgtrue");
              updateuser(pad(i,3),true);
            }
        })
      }
}