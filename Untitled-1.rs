sudo vi /etc/mongod.conf


use tolvve
db.createUser({user:'tolvveAdmin',pwd:'Starlight-2025',roles:[{role:'readWrite',db:'tolvve'}]})

  mongodb://tolvveAdmin:Starlight-2025@72.61.233.74:27017/tolvve

