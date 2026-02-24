/* Set location of AutoSave component */

require.config({
    baseUrl: REISys.Platform.WebRoot + '/Platform/Include/Javascript/',
    paths: {
        'text': 'lib/text',
        autosave: 'component/autosave',
        hierarchicalCheckbox: 'TypeScriptGenerated/UI/HierarchicalCheckbox',
        'GroupedGridModel': 'TypeScriptGenerated/UI/GroupedGridModel',
        'KoTemplateManager': 'TypeScriptGenerated/UI/KoTemplateManager',
    }
});