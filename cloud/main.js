Parse.Cloud.define("hello", function(request, response) {
    response.success("Hello world!");
});

Parse.Cloud.define("deleteMatchEvent", function(request, response) {
    if (Parse.User.current()) {
        var queryMatchEvent = new Parse.Query(Parse.Object.extend("MatchEvent"));
        queryMatchEvent.equalTo("objectId", request.params.matchEventId);
        queryMatchEvent.find({
            success: function(events) {
                events[0].destroy();
                response.success('Match Event deleted');
            }, error: function(obj, error) {
                response.error("Error fetching Match Event");
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addPlayer", function(request, response) {
    if (Parse.User.current()) {
        var Tournament = Parse.Object.extend("Tournament");
        var query = new Parse.Query(Tournament);
        query.get(request.params.tournamentId, {
            success: function(tournament) {
                var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
                queryTeam.get(request.params.teamId, {
                    success: function(team) {
                        var Player = Parse.Object.extend("Player");
                        var myPlayer = new Player();
                        myPlayer.set("tournamentId", tournament);
                        myPlayer.set("teamId", team);
                        myPlayer.set("name", request.params.player.name);
                        myPlayer.set("phone", request.params.player.phone);
                        myPlayer.set("email", request.params.player.email);
                        myPlayer.save(null, {
                            success: function(newPlayer) {
                                response.success(newPlayer);
                            },
                            error: function(obj, error) {
                                response.error(error);
                            }
                        });
                    },
                    error: function(obj, error) {
                        response.error(error);
                    }
                });
            },
            error: function(error) {
                response.error('Error adding Player');
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("matchGuests", function(request, response) {
    var queryMatchGuest = new Parse.Query(Parse.Object.extend("MatchGuest"));
    queryMatchGuest.find({
        success: function(guests) {
            response.success(guests);
        }, error: function(obj, error) {
            response.error("Error fetching guests");
        }
    });
});

Parse.Cloud.define("matchGuestsForMatch", function(request, response) {
    var queryMatchGuest = new Parse.Query(Parse.Object.extend("MatchGuest"));
    queryMatchGuest.containedIn('matchId', request.params.matches);
    queryMatchGuest.find({
        success: function(guests) {
            response.success(guests);
        }, error: function(obj, error) {
            response.error(error);
        }
    });
});

Parse.Cloud.define("matchLineupsForMatch", function(request, response) {
    var queryMatchGuest = new Parse.Query(Parse.Object.extend("MatchLineup"));
    queryMatchGuest.containedIn('matchId', request.params.matches);
    queryMatchGuest.find({
        success: function(guests) {
            response.success(guests);
        }, error: function(obj, error) {
            response.error(error);
        }
    });
});

Parse.Cloud.define("matchLineups", function(request, response) {
    var queryMatchLineup = new Parse.Query(Parse.Object.extend("MatchLineup"));
    queryMatchLineup.find({
        success: function(lineups) {
            response.success(lineups);
        }, error: function(obj, error) {
            response.error("Error fetching lineups");
        }
    });
});


Parse.Cloud.define("deleteGuests", function(request, response) {
    if (Parse.User.current()) {
        Parse.Object.destroyAll(request.params.guests, {
            success: function(data) {
                response.success(data);
            },
            error: function(obj, error) {
                response.error(error);
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addGuests", function(request, response) {
    if (Parse.User.current()) {
        var _ = require("underscore");
        var newGuests = [];
        var MatchGuest = Parse.Object.extend("MatchGuest");
        var guests = request.params.guests;
        _.each(guests, function(guest) {
            var myGuest = new MatchGuest();
            myGuest.set("matchId", request.params.match);
            myGuest.set("teamId", request.params.team);
            myGuest.set("name", guest.name);
            myGuest.set("phone", guest.phone);
            myGuest.set("email", guest.email);
            myGuest.save(null, {
                success: function(newGuest) {
                    newGuests.push(newGuest);
                },
                error: function(obj, error) {
                    response.error(error);
                }
            });
        });
        response.success(newGuests);
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("matchGuestsForTeam", function(request, response) {
    var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
    queryTeam.get(request.params.teamId, {
        success: function(team) {
            var queryMatchGuest = new Parse.Query(Parse.Object.extend("MatchGuest"));
            queryMatchGuest.equalTo("teamId", team);
            queryMatchGuest.find({
                success: function(guests) {
                    response.success(guests);
                }, error: function(obj, error) {
                    response.error("Error fetching guests");
                }
            });
        }, error: function(error) {
            response.error('Error fetching match');
        }
    });
});

Parse.Cloud.define("deletePlayerFromMatchLineup", function(request, response) {
    if (Parse.User.current()) {
        Parse.Object.destroyAll(request.params.deletedMatchLineups, {
            success: function(data) {
                response.success(data);
            },
            error: function(obj, error) {
                response.error(error);
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addPlayerToMatchLineup", function(request, response) {
    if (Parse.User.current()) {
        var _ = require("underscore");
        var newLineup = [];
        var MatchLineup = Parse.Object.extend("MatchLineup");
        var selectedPlayers = request.params.selectedPlayers;
        _.each(selectedPlayers, function(selectedPlayer) {
            var lineup = new MatchLineup();
            lineup.set("matchId", request.params.match);
            lineup.set("teamId", request.params.team);
            lineup.set("playerId", selectedPlayer);
            lineup.save(null, {
                success: function(myLineup) {
                    newLineup.push(myLineup);
                },
                error: function(obj, error) {
                    response.error(error);
                }
            });
        });
        response.success(newLineup);
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("matchLineupsForTeam", function(request, response) {
    var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
    queryTeam.get(request.params.teamId, {
        success: function(team) {
            var queryMatchLineup = new Parse.Query(Parse.Object.extend("MatchLineup"));
            queryMatchLineup.equalTo("teamId", team);
            queryMatchLineup.find({
                success: function(lineups) {
                    response.success(lineups);
                }, error: function(obj, error) {
                    response.error("Error fetching lineups");
                }
            });
        }, error: function(error) {
            response.error('Error fetching match');
        }
    });
});

Parse.Cloud.define("addUser", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var Team = Parse.Object.extend("Team");
            var query = new Parse.Query(Team);
            query.get(request.params.teamId, {
                success: function(team) {
                    var User = Parse.Object.extend("User");
                    var myUser = new User();
                    myUser.set("teamId", team);
                    myUser.set("username", request.params.username);
                    myUser.set("email", request.params.email);
                    myUser.set("password", request.params.password);
                    myUser.save(null, {
                        success: function(myUser) {
                            response.success(myUser);
                        },
                        error: function(obj, error) {
                            response.error(error);
                        }
                    });
                },
                error: function(error) {
                    response.error('Error adding user');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("users", function(request, response) {
    if (Parse.User.current()) {
        var query = new Parse.Query(Parse.User);
        query.find({
            success: function(results) {
                response.success(results);
            },

            error: function(error) {
                response.error('Error fetching users');
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addUpdateMatchEvent", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var _ = require("underscore");
            var Tournament = Parse.Object.extend("Tournament");
            var query = new Parse.Query(Tournament);
            query.get(request.params.tournamentId, {
                success: function(tournament) {
                    var queryMatch = new Parse.Query(Parse.Object.extend("Match"));
                    queryMatch.get(request.params.matchId, {
                        success: function(match) {
                            var matchEvent = request.params.matchEvent;
                            var queryPlayer = new Parse.Query(Parse.Object.extend("Player"));
                            console.log('id: ' + request.params.playerId);
                            queryPlayer.get(request.params.playerId, {
                                success: function(player) {
                                    if (matchEvent.objectId) {
                                        var queryMatchEvent = new Parse.Query(Parse.Object.extend("MatchEvent"));
                                        queryMatchEvent.get(matchEvent.objectId, {
                                            success: function(myMatchEvent) {
                                                myMatchEvent.set("playerId", player);
                                                myMatchEvent.set("type", matchEvent.type);
                                                myMatchEvent.set("time", matchEvent.time);
                                                myMatchEvent.save();
                                                response.success(myMatchEvent);
                                            },
                                            error: function(obj, error) {
                                                response.error(error);
                                            }
                                        });
                                    } else {
                                        var MatchEvent = Parse.Object.extend("MatchEvent");
                                        var myMatchEvent = new MatchEvent();
                                        myMatchEvent.set("playerId", player);
                                        myMatchEvent.set("tournamentId", tournament);
                                        myMatchEvent.set("matchId", match);
                                        myMatchEvent.set("type", matchEvent.type);
                                        myMatchEvent.set("time", matchEvent.time);
                                        myMatchEvent.save(null, {
                                                success: function(result) {
                                                    response.success(result);
                                                },
                                                error: function(obj, error) {
                                                    response.error(error);
                                                }
                                            }
                                        );
                                    }
                                },
                                error: function(obj, error) {
                                    response.error('Error fetching Player');
                                }
                            });
                        },
                        error: function(obj, error) {
                            response.error(error);
                        }
                    });
                },
                error: function(error) {
                    response.error('Error adding Tournament');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addUpdateMatchEvents", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var _ = require("underscore");
            var Tournament = Parse.Object.extend("Tournament");
            var query = new Parse.Query(Tournament);
            query.get(request.params.tournamentId, {
                success: function(tournament) {
                    var queryMatch = new Parse.Query(Parse.Object.extend("Match"));
                    queryMatch.get(request.params.matchId, {
                        success: function(match) {
                            var newlyAddedEvents = [];
                            var i = 0;
                            _.each(request.params.matchEvents, function(matchEventValue) {
                                console.log(JSON.stringify(matchEventValue));
                                console.log(i + '    ' + request.params.matchEvents.length + '   '  + matchEventValue.playerId);
                                var queryPlayer = new Parse.Query(Parse.Object.extend("Player"));
                                queryPlayer.get(matchEventValue.playerId.id, {
                                    success: function(player) {
                                        console.log('Player: ' + JSON.stringify(player));
                                        console.log(matchEventValue);
                                        if (matchEventValue.objectId) {
                                            var queryMatchEvent = new Parse.Query(Parse.Object.extend("MatchEvent"));
                                            queryMatchEvent.get(request.params.matchEventValue.objectId, {
                                                success: function(myMatchEvent) {
                                                    myMatchEvent.set("playerId", player);
                                                    myMatchEvent.set("type", matchEventValue.type);
                                                    myMatchEvent.set("time", matchEventValue.time);
                                                    myMatchEvent.save();
                                                    newlyAddedEvents.push(myMatchEvent);
                                                },
                                                error: function(obj, error) {
                                                    response.error(error);
                                                }
                                            });
                                        } else {
                                            var MatchEvent = Parse.Object.extend("MatchEvent");
                                            var myMatchEvent = new MatchEvent();
                                            myMatchEvent.set("playerId", player);
                                            myMatchEvent.set("tournamentId", tournament);
                                            myMatchEvent.set("matchId", match);
                                            myMatchEvent.set("type", matchEventValue.type);
                                            myMatchEvent.set("time", matchEventValue.time);
                                            myMatchEvent.save(null, {
                                                    success: function(myMatchEvent) {
                                                        newlyAddedEvents.push(myMatchEvent);
                                                    },
                                                    error: function(obj, error) {
                                                        response.error(error);
                                                    }
                                                }
                                            );
                                        }
                                    },
                                    error: function(obj, error) {
                                        console.log(error);
                                        response.error('Error fetching Player');
                                    }
                                });
                            });
                            //response.success(newlyAddedEvents);
                        },
                        error: function(obj, error) {
                            response.error(error);
                        }
                    });
                },
                error: function(error) {
                    response.error('Error adding Tournament');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addPlayers", function(request, response) {
    if (Parse.User.current()) {
        var _ = require("underscore");
        var Tournament = Parse.Object.extend("Tournament");
        var query = new Parse.Query(Tournament);
        query.get(request.params.tournamentId, {
            success: function(tournament) {
                var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
                queryTeam.get(request.params.teamId, {
                    success: function(team) {
                        var addedPlayers = [];
                        var Player = Parse.Object.extend("Player");
                        var players = request.params.players;

                        _.each(players, function(value) {
                            var myPlayer = new Player();
                            myPlayer.set("tournamentId", tournament);
                            myPlayer.set("teamId", team);
                            myPlayer.set("name", value.name);
                            if (value.phone) {
                                myPlayer.set("phone", value.phone);
                            }
                            if (value.email) {
                                myPlayer.set("email", value.email);
                            }
                            myPlayer.save(null, {
                                success: function(myPlayer) {
                                    addedPlayers.push(myPlayer);
                                },
                                error: function(obj, error) {
                                    response.error(error);
                                }
                            });
                        });
                        response.success(addedPlayers);
                    },
                    error: function(obj, error) {
                        response.error(error);
                    }
                });
            },
            error: function(error) {
                response.error('Error adding Player');
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("editMatch", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var queryMatch = new Parse.Query(Parse.Object.extend("Match"));
            queryMatch.get(request.params.objectId, {
                success: function(match) {
                    match.set("team1Score", request.params.team1Score);
                    match.set("team2Score", request.params.team2Score);
                    match.set("stage", request.params.stage);
                    match.set("status", request.params.status);
                    match.set("matchDateTime", new Date(request.params.matchDateTime));
                    match.set("message", request.params.message);
                    match.save();
                    response.success(match);
                },
                error: function(obj, error) {
                    response.error('Error fetching Match');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addMatch", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var Tournament = Parse.Object.extend("Tournament");
            var query = new Parse.Query(Tournament);
            query.get(request.params.tournamentId, {
                success: function(tournament) {
                    var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
                    queryTeam.get(request.params.team1Id, {
                        success: function(team1) {
                            queryTeam.get(request.params.team2Id, {
                                success: function(team2) {
                                    var Match = Parse.Object.extend("Match");
                                    var myMatch = new Match();
                                    myMatch.set("tournamentId", tournament);
                                    myMatch.set("team1Id", team1);
                                    myMatch.set("team2Id", team2);
                                    myMatch.set("stage", request.params.stage);
                                    myMatch.set("status", request.params.status);
                                    myMatch.set("matchDateTime", new Date(request.params.matchDateTime));
                                    myMatch.save(null, {
                                        success: function(myMatch) {
                                            response.success(myMatch);
                                        },
                                        error: function(obj, error) {
                                            response.error(error);
                                        }
                                    });
                                },
                                error: function(obj, error) {
                                    response.error('Error fetching team 2');
                                }
                            });
                        },
                        error: function(obj, error) {
                            response.error(error);
                        }
                    });
                },
                error: function(error) {
                    response.error('Error adding Team');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addTeam", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var Tournament = Parse.Object.extend("Tournament");
            var query = new Parse.Query(Tournament);
            query.get(request.params.tournamentId, {
                success: function(tournament) {
                    var queryGroup = new Parse.Query(Parse.Object.extend("Group"));
                    queryGroup.get(request.params.groupId, {
                        success: function(group) {
                            var Team = Parse.Object.extend("Team");
                            var myTeam = new Team();
                            myTeam.set("tournamentId", tournament);
                            myTeam.set("groupId", group);
                            myTeam.set("name", request.params.name);
                            myTeam.save(null, {
                                success: function(myTeam) {
                                    response.success(myTeam);
                                },
                                error: function(obj, error) {
                                    response.error(error);
                                }
                            });
                        },
                        error: function(obj, error) {
                            response.error(error);
                        }
                    });
                },
                error: function(error) {
                    response.error('Error adding Team');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("addGroup", function(request, response) {
    if (Parse.User.current()) {
        if (Parse.User.current().get("isAdmin")) {
            var Tournament = Parse.Object.extend("Tournament");
            var query = new Parse.Query(Tournament);
            query.get(request.params.tournamentId, {
                success: function(tournament) {
                    console.log(tournament);
                    console.log(JSON.stringify(tournament));
                    var Group = Parse.Object.extend("Group");
                    var myGroup = new Group();
                    myGroup.set("tournamentId", tournament);
                    myGroup.set("name", request.params.name);
                    myGroup.save(null, {
                        success: function(myGroup) {
                            response.success(myGroup);
                        },
                        error: function(obj, error) {
                            response.error(error);
                        }
                    });
                },
                error: function(error) {
                    response.error('Error addingGroup');
                }
            });
        } else {
            response.error("Authentication Failed!");
        }
    } else {
        response.error('Session Expired');
    }
});



Parse.Cloud.define("myLogin", function(request, response) {
    Parse.User.logIn(request.params.username, request.params.password, {
        success: function(user) {
            console.log('User: ' + user._sessionToken + ', ' + user.sessionToken);
            response.success({
                objectId: Parse.User.current().id,
                isAdmin: Parse.User.current().get('isAdmin'),
                username: Parse.User.current().get('username'),
                sessionToken: Parse.User.current()._sessionToken
            });
        },
        error: function(user, error) {
            console.log(error);
            response.error(error);
        }
    });

});

Parse.Cloud.define("authenticatedUser", function(request, response) {
    console.log('User: ' + request.user);
    if (Parse.User.current()) {
        response.success({
            success: true,
            objectId: Parse.User.current().id,
            isAdmin: Parse.User.current().get('isAdmin'),
            username: Parse.User.current().get('username'),
            teamId: Parse.User.current().get('teamId')
        });
    } else {
        response.error('Session Expired');
    }
});
Parse.Cloud.define("teams", function(request, response) {
    if (Parse.User.current()) {
        var query = new Parse.Query(Parse.Object.extend("Team"));
        query.find({
            success: function(results) {
                response.success(results);
            },

            error: function(error) {
                response.error('Error fetching teams');
            }
        });
    } else {
        response.error('Session Expired');
    }
});

Parse.Cloud.define("tournaments", function(request, response) {
    var Tournament = Parse.Object.extend("Tournament");
    var query = new Parse.Query(Tournament);
    query.find({
        success: function(results) {
            response.success(results);
        },

        error: function(error) {
            response.error('Error fetching tournaments');
        }
    });
});

Parse.Cloud.define("tournamentDetails", function(request, response) {
    var query = new Parse.Query(Parse.Object.extend("Tournament"));
    query.get(request.params.tournamentId, {
        success: function(tournament) {
            var queryGroup = new Parse.Query(Parse.Object.extend("Group"));
            queryGroup.equalTo("tournamentId", tournament);
            queryGroup.find({
                success: function(groups) {
                    var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
                    queryTeam.equalTo("tournamentId", tournament);
                    queryTeam.find({
                        success: function(teams) {
                            var queryMatch = new Parse.Query(Parse.Object.extend("Match"));
                            queryMatch.equalTo("tournamentId", tournament);
                            queryMatch.find({
                                success: function(matches) {
                                    var queryPlayer = new Parse.Query(Parse.Object.extend("Player"));
                                    queryPlayer.limit(1000);
                                    queryPlayer.equalTo("tournamentId", tournament);
                                    queryPlayer.find({
                                        success: function(players) {
                                            var queryEvents = new Parse.Query(Parse.Object.extend("MatchEvent"));
                                            queryEvents.limit(1000);
                                            queryEvents.equalTo("tournamentId", tournament);
                                            queryEvents.find({
                                                success: function(events) {
                                                    response.success({
                                                        tournament: tournament,
                                                        groups: groups,
                                                        teams: teams,
                                                        matches: matches,
                                                        players: players,
                                                        matchEvents: events
                                                    });
                                                }, error: function(obj, error) {
                                                    response.error("Error fetching matches");
                                                }
                                            });
                                        }, error: function(obj, error) {
                                            response.error("Error fetching matches");
                                        }
                                    });
                                }, error: function(obj, error) {
                                    response.error("Error fetching matches");
                                }
                            });
                        }, error: function(error) {
                            response.error('Error fetching teams');
                        }
                    });
                }, error: function(error) {
                    response.error('Error fetching groups');
                }
            });
        }, error: function(error) {
            response.error('Error fetching tournaments');
        }
    });
});


Parse.Cloud.define("adminTournamentDetails", function(request, response) {
    if (Parse.User.current()) {
        if (!Parse.User.current().get('isAdmin')) {
            response.error('Authentication Failed');
        }
        var query = new Parse.Query(Parse.Object.extend("Tournament"));
        query.get(request.params.tournamentId, {
            success: function(tournament) {
                var queryGroup = new Parse.Query(Parse.Object.extend("Group"));
                queryGroup.equalTo("tournamentId", tournament);
                queryGroup.find({
                    success: function(groups) {
                        var queryTeam = new Parse.Query(Parse.Object.extend("Team"));
                        queryTeam.equalTo("tournamentId", tournament);
                        queryTeam.find({
                            success: function(teams) {
                                var queryMatch = new Parse.Query(Parse.Object.extend("Match"));
                                queryMatch.equalTo("tournamentId", tournament);
                                queryMatch.find({
                                    success: function(matches) {
                                        var queryPlayer = new Parse.Query(Parse.Object.extend("Player"));
                                        queryPlayer.equalTo("tournamentId", tournament);
                                        queryPlayer.limit(1000);
                                        queryPlayer.find({
                                            success: function(players) {
                                                var queryMatchEvent = new Parse.Query(Parse.Object.extend("MatchEvent"));
                                                queryMatchEvent.equalTo("tournamentId", tournament);
                                                queryMatchEvent.limit(1000);
                                                queryMatchEvent.find({
                                                    success: function(events) {
                                                        response.success({
                                                            tournament: tournament,
                                                            groups: groups,
                                                            teams: teams,
                                                            matches: matches,
                                                            players: players,
                                                            matchEvents: events
                                                        });
                                                    }, error: function(obj, error) {
                                                        response.error("Error fetching match events");
                                                    }
                                                });
                                            }, error: function(obj, error) {
                                                response.error("Error fetching matches");
                                            }
                                        });
                                    }, error: function(obj, error) {
                                        response.error("Error fetching matches");
                                    }
                                });
                            }, error: function(error) {
                                response.error('Error fetching teams');
                            }
                        });
                    }, error: function(error) {
                        response.error('Error fetching groups');
                    }
                });
            }, error: function(error) {
                response.error('Error fetching tournaments');
            }
        });
    } else {
        response.error('Session Expired');
    }
});