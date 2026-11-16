/**
 * The admin, jahia, modulesManagement and bundle objects carry no id, so the shared Apollo cache replaces each one
 * on every write unless its type merges. A replacement drops the fields that another query wrote, and Apollo then
 * fetches that query again: the rows of the table load twice, and every poll reloads them.
 */
export const registerCachePolicies = () => {
    window.jahia.apolloClient.cache.policies.addTypePolicies({
        AdminQuery: {merge: true},
        JahiaAdminQuery: {merge: true},
        ModuleManagementQueryResult: {merge: true},
        GqlBundle: {merge: true}
    });
};
