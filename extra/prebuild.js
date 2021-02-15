const fs = require('fs-extra')

fs.copyFileSync('./static/srv/js/vue@2.prod.js', './static/srv/js/vue@s.js')
console.log('set overlay vue dist to prod')