function basedeviceid(widget_id, url, skin, parameters)
{   
     // to show this device id on your dashboard, add this widget to a dashboard:
     //deviceid:
     //widget_type: deviceid
     //title: "My id"

    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...

    self = this;

    // Initialization

    self.widget_id = widget_id;

    // Store on brightness or fallback to a default

    // Parameters may come in useful later on

    self.parameters = parameters;

    self.parameters.fields.value = localStorage['hadasboard-device-id']

    var callbacks = [];

    // Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
    // Initial will be called when the dashboard loads and state has been gathered for the entity
    // Update will be called every time an update occurs for that entity

    var monitored_entities =  [];

    // Finally, call the parent constructor to get things moving

    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks);

    // Function Definitions

    // The StateAvailable function will be called when
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state
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

        if (isNaN(value))
        {
            self.set_field(self, "value_style", self.parameters.css.text_style);
            self.set_field(self, "value", self.map_state(self, value))
        }
        else
        {
            self.set_field(self, "value_style", self.parameters.css.value_style);
            self.set_field(self, "value", self.format_number(self, value));
            self.set_field(self, "unit_style", self.parameters.css.unit_style);
            if ("units" in self.parameters)
            {
                self.set_field(self, "unit", self.parameters.units)
            }
            else
            {
                self.set_field(self, "unit", state.attributes["unit_of_measurement"])
            }
        }
    }
}
