import {
  FontManager,
  Font,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS,
} from '@samuelmeuli/font-manager';
import React, { useState, useEffect, useRef } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Portal } from 'reakit';
import { SelectedFont } from './elements';
import { FontList } from './List';

export const FontPicker = ({
  activeFontFamily = FONT_FAMILY_DEFAULT,
  onChange,
  apiKey,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [fontManager, setFontManager] = useState();
  const [style, setStyle] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const manager = new FontManager(
      apiKey,
      activeFontFamily,
      { ...OPTIONS_DEFAULTS, limit: 200 },
      onChange
    );
    setFontManager(manager);

    manager
      .init()
      .then(() => setLoadingStatus('finished'))
      .catch((err: Error) => {
        setLoadingStatus('error');
        console.error(err);
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (ref && ref.current) {
      const styles = ref.current.getBoundingClientRect();
      setStyle({
        x: styles.x,
        y: styles.y,
      });
    }
  }, [ref]);

  const onSelection = (e: any): void => {
    const active = e.target.textContent;
    if (!active) {
      throw Error(`Missing font family in clicked font button`);
    }
    fontManager.setActiveFont(active);
    toggleExpanded();
  };

  const toggleExpanded = () => setExpanded(exp => !exp);

  const fonts: Font[] =
    fontManager && Array.from(fontManager.getFonts().values());

  return (
    <>
      <SelectedFont
        ref={ref}
        type="button"
        done={loadingStatus === 'finished'}
        onClick={toggleExpanded}
        onKeyPress={toggleExpanded}
        disabled={loadingStatus === 'loading'}
      >
        {loadingStatus === 'loading' ? 'Loading Typefaces' : activeFontFamily}
      </SelectedFont>
      {expanded && loadingStatus === 'finished' && (
        <Portal>
          <div
            style={{
              position: 'fixed',
              zIndex: 11,
              top: style.y + 201,
              left: style.x,
            }}
          >
            <OutsideClickHandler onOutsideClick={() => setExpanded(false)}>
              <FontList
                fonts={fonts}
                onSelection={onSelection}
                activeFontFamily={activeFontFamily}
                expanded={expanded}
              />
            </OutsideClickHandler>
          </div>
        </Portal>
      )}
    </>
  );
};
