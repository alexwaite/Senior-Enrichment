const Sequelize = require('sequelize');

const conn = new Sequelize(process.env.DATABASE_URL, { logging: false });

const Campus = conn.define('campus', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: '',
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  description: {
    type: Sequelize.TEXT,
  },
});

const Student = conn.define('student', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
    isEmail: true,
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: '',
  },
  gpa: {
    type: Sequelize.FLOAT,
  },
});

Student.belongsTo(Campus);
Campus.hasMany(Student);

const syncAndSeed = () => {
  return conn.sync({ force: true }).then(() => {
    return Promise.all([
      Student.create({
        firstName: 'Moe',
        lastName: 'Smith',
        email: 'moe@stooges.com',
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/1/1b/Moe_Howard_1937_%28cropped%29.jpg',
        gpa: 3.21,
      }),
      Student.create({
        firstName: 'Curly',
        lastName: 'Smith',
        email: 'curly@stooges.com',
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/e/ef/Curlydisorder.jpg',
        gpa: 2.75,
      }),
      Student.create({
        firstName: 'Larry',
        lastName: 'Smith',
        email: 'larry@stooges.com',
        imageUrl:
          'https://s3.amazonaws.com/pq-imgs/images/bios/Larry-Fine.jpg-2415.jpg',
        gpa: 2.4,
      }),
      Campus.create({
        name: 'Stooge University',
        imageUrl:
          'https://c.o0bg.com/rf/image_960w/Boston/2011-2020/2018/09/06/BostonGlobe.com/Metro/Images/cavanaugh_OumouKanoute07_met.jpg',
        address: '33 University Drive',
        description: 'An enclave of knowledge',
      }),
      Campus.create({
        name: 'Buster Keaton College',
        imageUrl:
          'https://c.o0bg.com/rf/image_960w/Boston/2011-2020/2018/09/06/BostonGlobe.com/Metro/Images/cavanaugh_OumouKanoute07_met.jpg',
        address: '44 College Road',
        description: 'A sanctuary of learning',
      }),
    ])
      .then(([moe, curly, larry, stoogesU, bkc]) => {
        moe.setCampus(stoogesU);
        curly.setCampus(stoogesU);
        larry.setCampus(bkc);
      })
      .then(() => console.log('connection synced and seeded'));
  });
};

module.exports = { syncAndSeed, Student, Campus };
