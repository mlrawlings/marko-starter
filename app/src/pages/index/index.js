import template from './template.marko';

export const route = '/';

export const handler = (req, res) => {
    res.setHeader('content-type', 'text/html');
    template.render(req.params, res);
};
