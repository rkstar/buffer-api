Package.describe({
  name: 'rkstar:buffer-api',
  version: '1.1.0',
  // Brief, one-line summary of the package.
  summary: 'A wrapper for the Buffer API',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rkstar/buffer-api',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2')

  api.use('http')
  api.use('underscore')
  api.use('rkstar:accounts-buffer@1.1.0')

  api.export('BufferAPI')

  api.addFiles('buffer-api.js', 'server')
})