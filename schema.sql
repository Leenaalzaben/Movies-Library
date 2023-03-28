  DROP TABLE IF EXISTS moviet;
  CREATE TABLE IF NOT EXISTS moviet (
  id SERIAL NOT NULL ,
  moviename VARCHAR(255),
  comment VARCHAR(255),
   PRIMARY KEY (id)
);
