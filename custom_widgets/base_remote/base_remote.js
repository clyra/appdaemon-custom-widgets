function base_remote(widget_id, url, skin, parameters)
{
    self = this;
    
    self.widget_id = widget_id;
    
    self.parameters = parameters;
    
    self.toggle = toggle;
    
    self.OnButtonClick = OnButtonClick;
    
    if ("enable" in self.parameters && self.parameters.enable == 1)
    {
        var callbacks =
            [
                {"selector": '#' + widget_id + ' > span', "action": "click", "callback": self.OnButtonClick},
            ]
    }            
    else
    {
        var callbacks = []
    }        
     
    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate
    
    var monitored_entities = 
        [
            {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate},
        ];
    
    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)  

    // Function Definitions
    
    function OnStateAvailable(self, state)
    {        
        self.state = state.state;
        set_view(self, self.state)
    }
    
    function OnStateUpdate(self, state)
    {
        if (!("ignore_state" in self.parameters) || self.parameters.ignore_state == 0)
        {
            self.state = state.state;
            set_view(self, self.state)
        }
    }
    
    function OnButtonClick(self)
    {
        if (self.state == self.parameters.state_active)
        {
            args = self.parameters.post_service_inactive
            if ( "command" in self.parameters )
            { 
               var newargs = {};
               newargs["command"] = self.parameters.command;
	       args["json_args"] =  JSON.stringify(newargs);
            }  
        }
        else
        {
            args = self.parameters.post_service_active;
        }
        self.call_service(self, args);
        toggle(self);
        if ("momentary" in self.parameters)
        {
            setTimeout(function() { self.toggle(self) }, self.parameters["momentary"])
        }
    }
    
    function toggle(self)
    {
        if (self.state == self.parameters.state_active)
        {
            self.state = self.parameters.state_inactive;
        }
        else
        {
            self.state = self.parameters.state_active;
        }
        set_view(self, self.state)
    }
    
    // Set view is a helper function to set all aspects of the widget to its 
    // current state - it is called by widget code when an update occurs
    // or some other event that requires a an update of the view
    
    function set_view(self, state, level)
    {
        if (state == self.parameters.state_active || ("active_map" in self.parameters && self.parameters.active_map.includes(state)))
        {
            self.set_icon(self, "icon", self.icons.icon_on);
            self.set_field(self, "icon_style", self.css.icon_style_active)
        }
        else
        {
            self.set_icon(self, "icon", self.icons.icon_off);
            self.set_field(self, "icon_style", self.css.icon_style_inactive)
        }
        if ("state_text" in self.parameters && self.parameters.state_text == 1)
        {
            self.set_field(self, "state_text", self.map_state(self, state))
        }
    }
}
