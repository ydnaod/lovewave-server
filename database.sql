create table user_account
(
    id serial primary key,
    first_name varchar(64) NOT NULL,
    last_name varchar(64) NOT NULL,
    email varchar(128) UNIQUE NOT NULL,
    password varchar(64) NOT NULL,
    refresh_token varchar(255)
);

create table user_profile
(
    id serial primary key,
    first_name varchar(128) REFERENCES user_account(first_name) NOT NULL,
    user_account_id int references user_account(id) UNIQUE NOT NULL,
    playlist_id varchar(128) NOT NULL,
    photo text NOT NULL,
    theme_song_id varchar(128) not null
);

create table lyrics_slide
(
    id serial primary key,
    user_account_id int references user_account(id) UNIQUE NOT NULL,
    song_artist varchar(128) NOT NULL,
    song_title varchar(128) NOT NULL,
    favorite_lyric varchar(64) NOT NULL,
    line_one varchar(64) NOT NULL,
    line_two varchar(64) NOT NULL,
    line_three varchar(64),
    line_four varchar(64),
    line_five varchar(64)
);

create table swipes
(
    user_account_id int references user_account(id) NOT NULL,
    other_user_account_id int references user_account(id) NOT NULL,
    swiped varchar(128) NOT NULL,
    favorite_lyric_guess int,
    swipe_date DATE NOT NULL DEFAULT current_date,
    constraint id primary key (user_account_id, other_user_account_id)
);

create table conversation
(
    id serial primary key,
    user_account_id int references user_account(id) NOT NULL,
    other_user_Account_id int references user_account(id) NOT NULL,
    time_started timestamp not null default CURRENT_TIMESTAMP,
    time_closed TIMESTAMP
);

create table message
(
    id serial primary key,
    user_account_id int references user_account(id) NOT NULL,
    conversation_id int references conversation(id) NOT NULL,
    message text,
    ts timestamp not null default CURRENT_TIMESTAMP
);

--create user
insert into user_account (first_name, last_name, email, password)
values ('andy', 'test', 'test2@gmail.com', 'testpass');

--create admin user
insert into user_account (id, first_name, last_name, email, password)
values (999, 'admin', 'andy', 'admin@gmail.com', 'adminpassword');

--create profile
insert into user_profile
    (user_account_id, playlist_id, photo, theme_song_id)
values
    (1, '0BtWOyxZyTu7EmGIoLQeyH', 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/134969333_10225175813162837_4579429098583903124_o.jpg?_nc_cat=103&ccb=2&_nc_sid=730e14&_nc_ohc=7mpxbX422BUAX-r2y0B&_nc_ht=scontent-lga3-1.xx&oh=c1ac92375280c033abdc95fda17b1f1a&oe=601BC1B8'
        , '3jjujdWJ72nww5eGnfs2E7')

--select random matches
select id
from user_account
where id not in
	(select other_user_account_id
   from swipes
   where user_account_id = $1)
AND id != $1
limit 10;

--insert swipe
insert into swipes
(user_account_id, other_user_account_id, swiped)
values (7, 1, 'no');