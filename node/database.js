var userhash = { };
var songinfo = ""
var recommendations = "";
var next_anonymous = 1; 
var HOME = __dirname+"/../";
var maxbuffer = (1024 * 50000); //50 MB buffer between web view and processes

var exec = require('child_process').exec, child;

//Song functions
var init_song_info = function() {
    child = exec('java -cp '+process.env.CLASSPATH+':'+HOME+'target/classes/ org.mahout.examples.MusicRecommendation.GetSongInfo -t '+HOME+'tracks/track.txt -a '+HOME+'artists/artists.txt',
                {maxBuffer: maxbuffer}, function (error, stdout, stderr) {
            //console.log(stdout);
            if(error != null) {
                console.log("ERROR: "+error);
            }
            if(stdout != null) {
                songinfo = stdout;
            }
    });
};
exports.init_song_info = init_song_info;

var get_song_info = function() {
    return songinfo;
};
exports.get_song_info = get_song_info;

//Recommender
var recommend = function(req) {
   var id = req.data.id;
   var num = req.data.number;
   child = exec('java -cp '+process.env.CLASSPATH+':'+HOME+'target/classes org.mahout.examples.MusicRecommendation.App',
                {maxBuffer:maxbuffer, env:{numberRecommendations:num, recommendationUserID:id}, timeout:30000}, function ( error, stdout, stderr) {

           if(error != null) {
                console.log("ERROR: "+error);
           }
            
            if(stdout != null) {
                req.io.emit('recommend_done', {});
            }
           recommendations = stdout;
    });
};
exports.recommend = recommend;

var get_recommendations = function() {
    return recommendations;
};
exports.get_recommendations = get_recommendations;

//Add music preferences
var add_preference = function(req) {
    console.log(req.data);
    console.log("inside add preference");
    var trackname = req.data.track;
    var userid = req.data.trackid;
    var entry = userid+"\t"+trackname;
    child = exec('java -cp '+process.env.CLASSPATH+':'+HOME+'target/classes org.mahout.examples.MusicRecommendation.App',
                {maxBuffer:maxbuffer, env:{numberRecommendations:num, recommendationUserID:id}, timeout:30000}, function(error, stdout, stderr) {
            if(error != null) {
                console.log("ERROR: "+error);
            }
            console.log(stdout);
    });
};
exports.add_preference = add_preference;


