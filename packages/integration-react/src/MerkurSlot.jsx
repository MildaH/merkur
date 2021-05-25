import React from 'react';

import WidgetWrapper from './WidgetWrapper';
import AbstractMerkurWidget from './AbstractMerkurWidget';

export default class MerkurSlot extends AbstractMerkurWidget {
  /**
   * Returns access to current slot properties, based on it's name
   * passed in props.
   */
  get slot() {
    const { widgetProperties, slotName } = this.props;

    return (
      (widgetProperties &&
        widgetProperties.slots &&
        widgetProperties.slots[slotName]) ||
      null
    );
  }

  /**
   * @inheritdoc
   */
  get html() {
    return this.slot?.html || null;
  }

  /**
   * @inheritdoc
   */
  get container() {
    return (
      (this._isClient() &&
        document?.querySelector(this.slot?.containerSelector)) ||
      null
    );
  }

  /**
   * The component should update only in following cases:
   *  1) Component has no props.widgetProperties.
   *  2) Widget properties changed (name or version).
   *
   * @param {object} nextProps
   */
  shouldComponentUpdate(nextProps) {
    if (
      !this.props.widgetProperties ||
      !nextProps.widgetProperties ||
      AbstractMerkurWidget.hasWidgetChanged(
        this.props.widgetProperties,
        nextProps.widgetProperties
      )
    ) {
      return true;
    }

    return false;
  }

  /**
   * Cleanup when we receive empty widget properties.
   *
   * @param {object} prevProps
   * @param {object} prevState
   */
  componentDidUpdate(prevProps) {
    const { widgetProperties: currentWidgetProperties } = this.props;
    const { widgetProperties: prevWidgetProperties } = prevProps;

    if (!currentWidgetProperties && prevWidgetProperties) {
      this._removeSlot();

      return;
    }
  }

  /**
   * Cleanup when unmounting
   */
  componentWillUnmount() {
    this._removeSlot();
  }

  /**
   * There are two possible outputs from the render method:
   *  1) Fallback is rendered only, when there are no widget properties.
   *  2) WidgetWrapper is rendered in case of SSR (on server-side),
   *     SSR hydrate - with server-side rendered HTML and on client
   *     (SPA) without HTML.
   *
   * @return {React.ReactElement|null}
   */
  render() {
    const { widgetProperties } = this.props;

    if (!widgetProperties || !this.slot) {
      return this._renderFallback();
    }

    return (
      <WidgetWrapper
        containerSelector={this.slot.containerSelector}
        html={this._getWidgetHTML()}
      />
    );
  }

  /**
   * Cleanup after slot removal.
   */
  _removeSlot() {
    this._clearCachedHtml();
  }
}
