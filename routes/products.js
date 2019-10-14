const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const axios = require('axios');
const cheerio = require('cheerio');

/* GET all products. */
router.get('/all', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log(error)
  }
});

/* GET all products filtered by language */
router.get('/all/:lang', async (req, res, next) => {
  try {
    const { lang } = req.params;
    const products = await Product.find({ 'lang': lang });
    res.status(200).json(products);
  } catch (error) {
    console.log(error)
  }
});

/* GET one product by language and id */
router.get('/product/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ '_id': id });
    res.status(200).json(products);
  } catch (error) {
    console.log(error)
  }
});

// Scrape the web and save data in the db
router.post('/create', async (req, res, next) => {
  const url = 'https://sandbox5.dobcn.com/hiring/sergio/catalogo/';
  const urls = [
    ['https://sandbox5.dobcn.com/hiring/sergio/catalogo/', 'es'],
    ['https://sandbox5.dobcn.com/hiring/sergio/en/catalog/', 'en'],
    ['https://sandbox5.dobcn.com/hiring/sergio/pt/catalogo/', 'pt']
  ]

  for (let n = 0; n < urls.length; n++) {
    const productLink = []

    const response = await axios(urls[n][0]);
    const html = response.data;
    const $ = cheerio.load(html);
    const products = $('#catalog-container a.d-flex');
    for (const el in products) {
      if (el < products.length) {
        productLink.push(products[el].children[0].parent.attribs.href);
      }
    }

    for (product of productLink) {
      const response = await axios(product);
      const html = response.data;
      const $ = cheerio.load(html);
      const title = $('.prod-title')['0'].children[0].data;
      const subtitle = $('.prod-subtitle')['0'].children[0].data;
      const packing = $('.prod-flavour')['0'].children[0].data;
      const cn = $('.prod-cn')['0'].children[0].data;
      const description = $('.about-the-prod div p')['0'].children[0].data;
      const image = $('.prod-img')['0'].attribs.src;
      // features
      const features = [];
      const featuresTable = $('.about-the-prod table')['0'];
      if (featuresTable != undefined) {
        for (let i = 0; i < $('.about-the-prod table td img').length; i++) {
          const featuresIcon = $('.about-the-prod table td img')[i].attribs.src;
          const featuresName = $('.about-the-prod table td p')[i].children[0].data;
          features.push({ name: featuresName, icon: featuresIcon });
        }
      }
      const format = $('.collapsable-1 div div p')['1'].children[0].data;
      const use = $('.collapsable-2 div div p')['1'].children[0].data;
      // warning
      const warningData = $('.collapsable-3 div div p')['1'].children[0];
      const warning = (warningData != undefined) ? warningData.data : $.html('.collapsable-3 div div ul');
      const formula = $.html('.collapsable-0 div div');
      const info = $.html('.collapsable-4 div div');
      const type = $('.entry-header')['0'].attribs['data-test'];
      const lang = urls[n][1];
      try {
        await Product.create({ title, subtitle, packing, cn, description, image, features, format, use, warning, formula, info, type, lang })
        res.status(200).json({ message: 'DB created' });
      } catch (error) {
        console.log(error);
      }
    }
  }
});

module.exports = router;
