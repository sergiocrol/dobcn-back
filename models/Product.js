const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  subtitle: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  packing: {
    type: String,
    require: true
  },
  cn: {
    type: String,
    require: true
  },
  features: [
    {
      name: {
        type: String,
        require: true
      },
      icon: {
        type: String,
        require: true
      }
    }
  ],
  formula: [
    {
      /*name: {
        title: {
          type: String,
          default: 'none'
        },
        subtitle: [
          {
            type: String
          }
        ]
      }*/
      type: String,
      require: true
    }
  ],
  format: {
    type: String,
    require: true
  },
  use: {
    type: String,
    require: true
  },
  warning: {
    type: String,
    require: true
  },
  info: [
    {
      /*name: {
        title: {
          type: String,
          default: 'none'
        },
        subtitle: [
          {
            type: String
          }
        ]
      }*/
      type: String,
      require: true
    }
  ],
  image: {
    type: String,
    require: true
  },
  lang: {
    type: String,
    require: true,
    default: 'es'
  },
  family: {
    type: String,
    require: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;