Requirements: 
Java JDK 17.0.15 	
Maven 3.6.3
PostgreSQL	12.22
Node.js	v22.15.1 	
npm	10.9.2
Git

Backend Setup:
1) Create a new database:
  CREATE DATABASE exampledb;
2) Run the SQL scripts (optional)
  psql -U your_db_user -d exampledb -f ./exampleDB.sql
3) Edit the file application.properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/exampledb
  spring.datasource.username=your_db_user
  spring.datasource.password=your_db_password
4) Build 
  mvn clean install
5) Start the application
   mvn spring-boot:run
6) The server should start on http://localhost:8080

Frontend Setup:
1) Install the required npm packages
  npm install
2) Start the application
  npm run dev
3) The server should start on http://localhost:5173
