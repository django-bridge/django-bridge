interface ShellResponseLoadIt {
    status: 'load-it';
}

interface ShellResponseRender {
    status: 'render';
    view: string;
    context: any;
}

interface ShellResponseNotFound {
    status: 'not-found';
}

interface ShellResponsePermissionDenied {
    status: 'permission-denied';
}

export type ShellResponse = ShellResponseLoadIt
                          | ShellResponseRender
                          | ShellResponseNotFound
                          | ShellResponsePermissionDenied;

export async function shellFetch(url: string): Promise<ShellResponse> {
    if (!url.startsWith('/admin/')) {
        return Promise.resolve({
            status: 'load-it',
        });
    }

    const response = await fetch(url, { headers: { 'X-Requested-With': 'WagtailShell' } });
    if (!response.headers.get('X-WagtailShellStatus')) {
        console.warn("WagtailShell Warning: A non-JSON response was returned from the server. Did you forget to add the 'download' attribute to an '<a>' tag?");
        return {
            status: 'load-it',
        };
    }
    return response.json();
}
