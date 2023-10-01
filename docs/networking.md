# Networking

You can override the default host binding (`127.0.0.1`) and the default port (`31982`).

If you change either of these, you need to update the `uri` in `gamestate_integration_drweissbrot_hud.cfg` to match.  
If you change the host binding, the HUD will accept connections from any device on the network.
This may not be a good idea, especially if people you don't trust are on the same network.

To bind to all hosts, set the host to `0.0.0.0`.


## Environment Variables
You can set the environment variables `HOST` and `PORT`, for example:
```sh
HOST=0.0.0.0 PORT=3000 ./cs-hud-linux
```


## theme.json
You can set a `host` and `port` key in a `theme.json`, either in your `userspace` directory, or in a theme directory.
For example:
```json
{
	"parent": "fennec",
	"host": "0.0.0.0",
	"port": 3000
}
```
