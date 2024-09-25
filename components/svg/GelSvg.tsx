'use client'
import React from 'react';
import Svg, { Path, Rect, Mask, G } from 'react-native-svg';

export default class GelSvg extends React.Component {
   render() {
    return (
      <Svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Rect width="84.9999" height="84.9999" rx="17" fill="white"/>
          <Mask id="mask0_380_579" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="26" y="16" width="33" height="53">
              <Path d="M34.1875 57.9375H50.8125V66.25H34.1875V57.9375Z" fill="#555555" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              <Path d="M56.75 18.75H28.25C28.25 18.75 28.25 28.25 29.4375 38.9375C30.625 49.625 34.1875 57.9375 34.1875 57.9375H50.8125C50.8125 57.9375 54.375 49.625 55.5625 38.9375C56.75 28.25 56.75 18.75 56.75 18.75Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              <Path d="M29.4375 25.875H55.5625M38.5136 39.9932C40.2129 37.7607 41.5239 34.6744 42.2316 33C43.4714 34.6744 46.1622 38.8758 47.0125 41.1094C48.0741 43.9001 45.4189 47.25 42.2316 47.25C39.0444 47.25 36.3891 42.785 38.5136 39.9932Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </Mask>
          <G mask="url(#mask0_380_579)">
              <Path d="M14 14H71V71H14V14Z" fill="#6E6E6E"/>
          </G>
      </Svg>
    )
  }
}