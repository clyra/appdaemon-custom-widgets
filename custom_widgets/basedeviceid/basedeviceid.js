function basedeviceid(widget_id, url, skin, parameters)
{   
     // to show this device id on your dashboard, add this widget to a dashboard:
     // deviceid:
     // widget_type: deviceid
     // title: "My id"
     
     // to set the device id, also add:
    // id: "1234"
	
    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...

    self = this;

    // Initialization

    self.widget_id = widget_id;

    self.parameters = parameters;

    //if id was defined, then store it in localstorage
    if (self.parameters.fields.value)
    {
        localStorage['hadasboard-device-id'] = self.parameters.fields.value     
    }

    self.parameters.fields.value = localStorage['hadasboard-device-id']

    var callbacks = [];

    var monitored_entities =  [];

    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks);

    // Methods

    function OnStateAvailable(self, state)
    {
        set_value(self, state)
    }

    function OnStateUpdate(self, state)
    {
        set_value(self, state)
    }

    function set_value(self, state)
    {
        value = state.state
        self.set_field(self, "value_style", self.parameters.css.text_style);
        self.set_field(self, "value", value);
    }
}
