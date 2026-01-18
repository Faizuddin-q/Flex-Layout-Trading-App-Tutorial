import { IJsonModel } from 'flexlayout-react';

export const complexLayout: IJsonModel = {
  global: {
    tabSetEnableMaximize: true,
    tabSetEnableTabStrip: true,
    tabEnablePopout: true,
    splitterSize: 6,
    borderSize: 250,
    borderMinSize: 100,
  },
  borders: [
    {
      type: "border",
      location: "left",
      size: 250,
      selected: 0,
      children: [
        {
          type: "tab",
          id: "navigator",
          name: "Navigator",
          component: "NavigatorPanel",
          enableClose: false,
        },
        {
          type: "tab",
          id: "search",
          name: "Search",
          component: "SearchPanel",
          enableClose: false,
        }
      ]
    },
    {
      type: "border",
      location: "bottom",
      size: 200,
      selected: -1,
      children: [
        {
          type: "tab",
          id: "console",
          name: "Console",
          component: "ConsolePanel",
          enableClose: false,
        }
      ]
    }
  ],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        type: "tabset",
        weight: 70,
        id: "workspace",
        children: [
          {
            type: "tab",
            name: "Editor",
            component: "EditorPanel",
            id: "editor-main",
          },
          {
            type: "tab",
            name: "Design",
            component: "DesignPanel",
            id: "design-main",
          }
        ]
      },
      {
        type: "tabset",
        weight: 30,
        id: "inspector-panel",
        children: [
          {
            type: "tab",
            name: "Inspector",
            component: "InspectorPanel",
            id: "inspector-main",
          }
        ]
      }
    ]
  }
};
