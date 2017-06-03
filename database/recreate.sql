drop table if exists dream;

create table dream (
  id bigserial primary key,
  title varchar(255)
);

insert into dream (title) values ('Compose a tune');
insert into dream (title) values ('Visit Zaire');
insert into dream (title) values ('Write a sci-fi novel');