var express = require('express');
var app = express();
var ldap = require('ldapjs');

app.listen(5000, function() {
    console.log("server start On port 5000")
})

var client = ldap.createClient({
    url: 'ldap://127.0.0.1:10389'
});

function authenticateDN(username, password){
    

    

    client.bind(username, password, function(err) {
        if(err){
            console.log("Error in connect "+err)
        }else {
            console.log("success connect to LDAP");
            //searchUser();
            //addUser();
            //deleteUser();
            //addUserToGroup('cn=Administrators,ou=groups,ou=system');
            deleteUserFromGroup('cn=Administrators,ou=groups,ou=system');
              
        }
    });
}

function searchUser()
{
    var opts = {
        filter: '(|(uid=2)(sn=junaedi)(cn=jaka))',
        scope: 'sub',
        attributes: ['sn']
      };

    client.search('ou=users,ou=system', opts, function(err, res) {
        if(err)
        {
            console.log("Error in connect "+err)
        }else {

        res.on('searchEntry', function(entry) {
            console.log('entry: ' + JSON.stringify(entry.object));
          });
          res.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
          });
          res.on('error', function(err) {
            console.error('error: ' + err.message);
          });
          res.on('end', function(result) {
            console.log('status: ' + result.status);
          });
        }
      });
}

function addUser()
{
    var entry = {
        
        sn: 'bar',
        //email: ['foo@bar.com', 'foo1@bar.com'],
        objectclass: 'inetOrgPerson'
      };
      client.add('cn=ferry1,ou=users,ou=system', entry, function(err) {
        if(err)
        {
            console.log("error add user"+err);
        }else{
            console.log("success delete user")
        }
      });
    }
      
function deleteUser()
{
    client.del('cn=ferry,ou=users,ou=system', function(err) {
        if(err)
        {
            console.log("error delete user "+err);
        }else{
            console.log("success delete user")
        }
      });
}
      
function addUserToGroup(groupname)
{
    var change = new ldap.Change({
        operation: 'add',
        modification: {
          uniqueMember: 'cn=arfan,ou=users,ou=system'
        }
      });
      
      client.modify(groupname, change, function(err) {
        
        if(err)
        {
            console.log("error add user group "+err);
        }else{
            console.log("success add user group")
        }

      });
}

function deleteUserFromGroup(groupname)
{
    var change = new ldap.Change({
        operation: 'delete',
        modification: {
          uniqueMember: 'cn=adit,ou=users,ou=system'
        }
      });
      
      client.modify(groupname, change, function(err) {
        
        if(err)
        {
            console.log("error elete user group "+err);
        }else{
            console.log("success delete user group")
        }

      });
}

authenticateDN("uid=admin,ou=system", "secret")