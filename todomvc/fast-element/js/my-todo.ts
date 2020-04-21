import { FASTElement, customElement, attr, html, css } from '../node_modules/@microsoft/fast-element/dist/index.js';
import { repeat } from '../node_modules/@microsoft/fast-element/dist/directives/repeat.js';

let nextId = 0;

const template = html<MyTodo>`<h1>Todos WC</h1>
<section>
    <todo-input @submit=${(x, c) => x.addItem(c.event)}></todo-input>
    <ul id="list-container">
        ${repeat(
            x => x.list,
            html`
                <todo-item 
                    text="${x => x.text}" 
                    checked="${x => x.checked}" 
                    index="${(x, c) => c.index}" 
                    @removed=${(x, c) => c.parent.removeItem(c.event)}
                    @checked=${(x, c) => c.parent.toggleItem(c.event)}>
                </todo-item>`)}
    </ul>
</section>`;

const styles = css`h1 {
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
}

section {
    background: #fff;
    margin: 130px 0 40px 0;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

#list-container {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid #e6e6e6;
}`;

@customElement({name:'my-todo', template, styles})
class MyTodo extends FASTElement {
   @attr list : any[]

    constructor() {
        super();
        this.list = [{ id: nextId++, text: 'my initial todo', checked: false }, { id: nextId++, text: 'Learn about Web Components', checked: true }];
    }

    public addItem(e) {
        this.list.splice(this.list.length, 0, { id: nextId++, text: e.detail, checked: false });
    }

    public removeItem(e) {
        this.list.splice(e.detail, 1);
    }

    public toggleItem(e) {
        const item = this.list[e.detail];
        item.checked = !item.checked;
    }
}

