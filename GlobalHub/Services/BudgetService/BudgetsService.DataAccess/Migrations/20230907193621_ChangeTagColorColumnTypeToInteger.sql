alter table "Tags"
    alter column "Color" drop default;
alter table "Tags"
    alter column "Color" type integer USING ("Color"::integer);
