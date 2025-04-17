from bottle import get, static_file, post, request, run
import json

@get('/')
@get('/<filename>')
def index_html(filename='index.html'):
    return static_file(filename, root='main')

@get('/admin.js')
def admin_js():
    return static_file('admin.js', root='special')

@post('/admin')
@post('/admin.html')
def admin_page():
    username = request.forms.getunicode('username')

    if username == 'admin': # XXX need better security
        return static_file('admin.html', root='special')
    
    else:
        return static_file('accessdenied.html', root='special')

@post('/update')
@post('/update.html')
def update():
    username = request.forms.getunicode('username')

    if username != 'admin':
        return static_file('accessdenied.html', root='special')
    
    data = {}

    with open('main/lessons_test.json', 'r', encoding='utf-8') as f:
        data = json.loads(f.read())
    
    for i in request.forms:
        if i == 'username':
            continue

        item = request.forms.getunicode(i)
        pos = i.split("-")[1:] # always begins with a -

        element = data
        for j in pos[:-1]:
            if isinstance(element, dict):
                try:
                    element = element[j]
                except KeyError:
                    element[j] = {}
                    element = element[j]
            elif isinstance(element, list):
                element = element[int(j)]                    
        
        if isinstance(element, dict):
            element[pos[-1]] = item
        elif isinstance(element, list):
            element[int(pos[-1])] = item

    with open('main/lessons_test.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(data, indent=4, ensure_ascii=False))

    return static_file('index.html', root='main')


run(host='0.0.0.0', port=8000)
