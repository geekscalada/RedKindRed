#sudo npx sequelize-cli db:migrate:undo:all

#Generate user model
sudo npx sequelize-cli model:generate --force --name User \
--attributes name:string,\
surname:string,\
nick:string,\
email:string,\
password:string,\
role:string,\
image:string\



#Generate publication model
sudo npx sequelize-cli model:generate --force --name Publication \
--attributes text:string,\
surname:string,\
file:string,\
userID:integer\








