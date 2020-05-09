import { componentPlugin } from '@merkur/plugin-component';
import { eventEmitterPlugin } from '@merkur/plugin-event-emitter';
import { name, version } from '../package.json';
import View from './component/View';

export const widgetProperties = {
  name,
  version,
  $plugins: [componentPlugin, eventEmitterPlugin],
  container: '#container',
  View,
  assets: [
    {
      type: 'script',
      source: 'http://localhost:4444/static/widget-client.js',
    },
    {
      type: 'stylesheet',
      source: 'http://localhost:4444/static/widget-client.css',
    },
  ],
  onClick(widget) {
    widget.setState({ counter: widget.state.counter + 1 });
  },
  onReset(widget) {
    widget.setState({ counter: 0 });
  },
  load(widget) {
    return {
      counter: 0,
      ...widget.props,
    };
  },
};
