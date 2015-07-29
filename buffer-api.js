BufferAPI = function(defaults){
  var user = Meteor.users.findOne({_id: this.userId}),
    validate = function(input){
      _.defaults(input, {
        throw: true,
        error: {}
      })
      var valid = {
        string: (input.hasOwnProperty('string') && ((typeof input.string ==='string') && (input.string.length > 0))),
        object: (input.hasOwnProperty('object') && (typeof input.object === 'object')),
        function: (input.hasOwnProperty('function') && (typeof input.function === 'function')),
        error: null
      }

      if( input.hasOwnProperty('function') && !valid.function && input.throw ){
        throw Meteor.Error(500, 'No callback method specified')
      }

      if( input.hasOwnProperty('string') && !valid.string && input.error.string ){
        input.function(new Meteor.Error(input.error.string.error, input.error.string.reason))
        valid.error = true
        return valid
      }

      if( input.hasOwnProperty('object') && !valid.object && input.error.object ){
        input.function(new Meteor.Error(input.error.object.error, input.error.object.reason))
        valid.error = true
        return valid
      }

      return valid
    }

  _.extend(defaults,{
    apiUrl: 'https://api.bufferapp.com/1/',
    access_token: (user.services && user.services.buffer) ? user.services.buffer.access_token : null,
    profileId: user.services.buffer.id
  })

  if( !defaults.access_token ){
    throw new Meteor.Error(501, 'Buffer is not authorized on this user account.  Please connect Buffer account.')
    return null
  }

  var execute = function(options, callback){
    if( typeof options === 'string' ){
      var url = options
      options = {url: url}
    }
    _.defaults(options, {
      url: '',
      params: {},
      method: 'GET'
    })
    _.defaults(options.params, {access_token: defaults.access_token})

    if( !options.url || (options.url.length < 1) ){
      callback(new Meteor.Error(500, 'No path to Buffer API provided.'))
      return
    }

    if( options.url.indexOf(defaults.apiUrl) != 0 ){
      options.url = defaults.apiUrl + options.url + '.json'
    }

    HTTP.call(options.method, options.url, {params: options.params}, function(err, response){
      if( response.statusCode != 200 ){
        callback(new Meteor.Error(response.data.status_code, response.data.status_message))
      } else {
        callback(null, response.data)
      }
    })
  }

  this.user = function(callback){
    validate({
      function: callback
    })

    execute('user', callback)
  }

  this.info = function(callback){
    validate({
      function: callback
    })

    execute('info/configuration', callback)
  }

  this.profiles = function(profileId, callback){
    if( !callback && (typeof profileId === 'function') ){
      callback = profileId
      profileId = null
    }

    var input = {
      function: callback
    }
    if( profileId ){
      input.string = profileId
      input.error = {string: {error: 501, reason: 'Invalid profile id provided.'}}
    }

    if( validate(input).error ){
      return
    }

    var path = 'profiles'
      path += (profileId) ? '/'+profileId : ''

    execute(path, callback)
  }

  this.schedules = {
    info: function(profileId, callback){
      if( validate({
        string: profileId,
        function: callback,
        error: {
          string: {error: 501, reason: 'Invalid profile id provided.'}
        }
      }).error ){
        return
      }

      execute('profiles/'+profileId+'/schedules', callback)
    },

    update: function(profileId, params, callback){
      if( validate({
        string: profileId,
        object: params,
        function: callback,
        error: {
          string: {error: 501, reason: 'Invalid profile id provided.'},
          object: {error: 502, reason: 'Invalid parameters provided.'}
        }
      }).error ){
        return
      }

      execute({
        url: 'profiles/'+profileId+'/schedules/update',
        method: 'POST',
        params: params
      }, callback)
    }
  }

  this.updates = {
    byId: function(updateId, callback){
      if( validate({
          string: updateId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid update id provided.'}
          }
        }).error ){
        return
      }

      execute('updates/'+updateId, callback)
    },

    pending: function(profileId, params, callback){
      if( !callback && (typeof params === 'function') ){
        callback = params
        params = {}
      }

      if( validate({
          string: profileId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid profile id provided.'}
          }
        }).error ){
        return
      }

      execute({
        url: 'profiles/'+profileId+'/updates/pending',
        params: (valid.object) ? params : {}
      }, callback)
    },

    sent: function(profileId, params, callback){
      if( !callback && (typeof params === 'function') ){
        callback = params
        params = {}
      }

      if( validate({
          string: profileId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid profile id provided.'}
          }
        }).error ){
        return
      }

      execute({
        url: 'profiles/'+profileId+'/updates/sent',
        params: (valid.object) ? params : {}
      }, callback)
    },

    interactions: function(updateId, params, callback){
      if( !validate({
          string: udpateId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid update id provided.'},
            object: {error: 502, reason: 'Invalid parameters provided.'}
          }
        }).error ){
        return
      }

      execute({
        url: 'updates/'+updateId+'/interactions',
        params: params
      }, callback)
    },

    reorder: function(profileId, params, callback){
      if( validate({
          string: profileId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid profile id provided.'},
            object: {error: 502, reason: 'Invalid parameters provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'profiles/'+profileId+'/updates/reorder',
        params: params
      }, callback)
    },

    shuffle: function(profileId, params, callback){
      if( !callback && (typeof params === 'function') ){
        callback = params
        params = {}
      }

      if( validate({
          string: profileId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid profile id provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'profiles/'+profileId+'/updates/shuffle',
        params: (valid.object) ? params : {}
      }, callback)
    },

    add: function(params, callback){
      if( validate({
          object: params,
          function: callback,
          error: {
            object: {error: 502, reason: 'Invalid parameters provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'updates/create',
        params: params
      }, callback)
    },

    update: function(updateId, params, callback){
      if( validate({
          string: updateId,
          object: params,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid profile id provided.'},
            object: {error: 502, reason: 'Invalid parameters provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'updates/'+updateId+'/update',
        params: params
      }, callback)
    },

    share: function(updateId, callback){
      if( validate({
          string: updateId,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid update id provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'updates/'+updateId+'/share'
      }, callback)
    },

    destroy: function(updateId, callback){
      if( validate({
          string: updateId,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid update id provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'updates/'+updateId+'/destroy'
      }, callback)
    },

    bump: function(updateId, callback){
      if( validate({
          string: updateId,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid update id provided.'}
          }
        }).error ){
        return
      }

      execute({
        method: 'POST',
        url: 'updates/'+updateId+'/move_to_top'
      }, callback)
    }
  }

  this.links = {
    shares: function(url, callback){
      if( validate({
          string: url,
          function: callback,
          error: {
            string: {error: 501, reason: 'Invalid update URL provided.'}
          }
        }).error ){
        return
      }

      execute({
        url: 'links/shares',
        params: {url: url}
      }, callback)
    }
  }
}