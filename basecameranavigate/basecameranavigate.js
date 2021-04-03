function basecameranavigate(widget_id, url, skin, parameters)
{
    self = this

    // Initialization
    this.widget_id = widget_id
    this.skin = skin
    this.parameters = parameters;

    self.OnButtonClick = OnButtonClick

    var callbacks = 
        [
            {"selector": '#' + widget_id + ' > img', "action": "click","callback": self.OnButtonClick},
        ]
    
    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate

    var monitored_entities =
        [
            {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate},
        ];

    // Call the parent constructor to get things moving

    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks);

    // Set the url

    self.index = 0;
    refresh_frame(self)
    self.timeout = undefined;
    self.command = undefined;

    //parse parameters
    if ("url" in self.parameters || "dashboard" in self.parameters)
    {
        var append = "";

        if ("url" in parameters)
        {
            clickurl = parameters.url
        }
        else
        {
            clickurl = "/" + parameters.dashboard
            if ("forward_parameters" in self.parameters)
            {
                append = appendURL(self.parameters.forward_parameters);
            }
        }

        var i = 0;

        if ("args" in self.parameters)
        {
            clickurl = clickurl + "?";

            for (var key in self.parameters.args)
            {
                if (i != 0)
                {
                    clickurl = clickurl + "&"
                }
                clickurl = clickurl + key + "=" + self.parameters.args[key];
                i++
            }
        }

        if ("skin" in self.parameters)
        {
            theskin = self.parameters.skin
        }
        else
        {
            theskin = skin
        }

        if (i == 0)
        {
            clickurl = clickurl + "?skin=" + theskin;
            i++
        }
        else
        {
            clickurl = clickurl + "&skin=" + theskin;
            i++
        }

        if ("sticky" in self.parameters)
        {
            if (i == 0)
            {
                clickurl = clickurl + "?sticky=" + self.parameters.sticky;
                i++
            }
            else
            {
                clickurl = clickurl + "&sticky=" + self.parameters.sticky;
                i++
            }
        }

        if ("return" in parameters)
        {
            if (i == 0)
            {
                clickurl = clickurl + "?return=" + self.parameters.return;
                i++
            }
            else
            {
                clickurl = clickurl + "&return=" + self.parameters.return;
                i++
            }
        }
        else
        {
            if ("timeout" in parameters)
            {
                try {
                    current_dash = location.pathname.split('/')[1];
                    if (i == 0)
                    {
                        clickurl = clickurl + "?return=" + current_dash;
                        i++
                    }
                    else
                    {
                        clickurl = clickurl + "&return=" + current_dash;
                        i++
                    }
                }    
                catch
                { 
                    console.log('not a dashboard?')
                }
            }       
        }

        if ("timeout" in self.parameters)
        {
            if (i == 0)
            {
                clickurl = clickurl + "?timeout=" + self.parameters.timeout;
                i++
            }
            else
            {
                clickurl = clickurl + "&timeout=" + self.parameters.timeout;
                i++
            }
        }

        if ( append != "" )
        {
            if (i == 0)
            {
                clickurl = clickurl + "?" + append;
                i++
            }
            else
            {
                clickurl = clickurl + "&" + append;
                i++
            }
        }
    }

    self.set_field(self, "clickurl", clickurl);
    
    

    function refresh_frame(self)
    {
        if ("base_url" in self.parameters && "access_token" in self) {
            var endpoint = '/api/camera_proxy/'
            if ('stream' in self.parameters && self.parameters.stream) {
                endpoint = '/api/camera_proxy_stream/'
            }

             var url = self.parameters.base_url + endpoint + self.parameters.entity + '?token=' + self.access_token
        }
        else
        {
            var url = '/images/Blank.gif'
        }

        if (url.indexOf('?') > -1)
        {
            url = url + "&time=" + Math.floor((new Date).getTime()/1000);
        }
        else
        {
            url = url + "?time=" + Math.floor((new Date).getTime()/1000);
        }

        self.set_field(self, "img_src", url);
        self.index = 0
        var refresh = 10
        
        if ('stream' in self.parameters && self.parameters.stream == "on") {
            refresh = 0
        }
        if ("refresh" in self.parameters)
        {
            refresh = self.parameters.refresh
        }

        if (refresh > 0)
        {
            clearTimeout(self.timeout)
            self.timeout = setTimeout(function() {refresh_frame(self)}, refresh * 1000);
        }


     }

     // Function Definitions

     // The StateAvailable function will be called when
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state

     function OnStateAvailable(self, state)
    {
        self.state = state.state;
        self.access_token = state.attributes.access_token
        refresh_frame(self)
    }

     // The OnStateUpdate function will be called when the specific entity
    // receives a state update - its new values will be available
    // in self.state[<entity>] and returned in the state parameter

     function OnStateUpdate(self, state)
    {
        self.state = state.state;
        self.access_token = state.attributes.access_token
        refresh_frame(self)
    }

    function appendURL(forward_list)
    {
        var append = "";
        if (location.search != "")
        {
            var query = location.search.substr(1);
            var result = {};
            query.split("&").forEach(function(part) {
                var item = part.split("=");
                result[item[0]] = decodeURIComponent(item[1]);
            });

            var useand = false;
            for (arg in result)
            {
                if (arg != "timeout" && arg != "return" && arg != "sticky" && arg != "skin" &&
                    (forward_list.includes(arg) || forward_list.includes("all")) )
                {
                    if (useand)
                    {
                        append += "&";
                    }
                    useand = true;
                    append += arg
                    if (result[arg] != "undefined" )
                    {
                        append += "=" + result[arg]
                    }
                }
            }
        }
        return append
    }

    function OnButtonClick(self)
    {
        console.log('being there');
        eval(self.command);
    }

 }
