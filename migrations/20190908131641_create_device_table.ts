import * as Knex from 'knex'

// {
//     "id":1,
//     "name":"Front Lamp",
//     "state":"off",
//     "type":"lamp",
//     "location":"Front door",
//     "color":"red"
// }

async function up(knex: Knex): Promise<any> {
  const exist = await knex.schema.hasTable('devices')
  if (exist) return

  return knex.schema.createTable('devices', t => {
    t.increments('id')
    t.string('name')
    t.string('status')
    t.string('type')
    t.string('location')
    t.string('color')
  })
}

async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('devices')
}
exports.up = up
exports.down = down
