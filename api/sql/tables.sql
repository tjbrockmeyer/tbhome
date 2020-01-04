
CREATE TABLE list (
    name text primary key,
    description text not null
);

CREATE TABLE list_items (
    list_name text references list(name),
    name text,
    description text not null,
    primary key (list_name, name)
);