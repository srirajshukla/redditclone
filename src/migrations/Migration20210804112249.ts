import { Migration } from '@mikro-orm/migrations';

export class Migration20210804112249 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "update_at" timestamptz(0) not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_password_unique" unique ("password");');
  }

}
