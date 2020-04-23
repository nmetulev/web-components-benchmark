import { LitElement, html, css } from '../node_modules/lit-element/lit-element.js';
import { repeat } from '../node_modules/lit-html/directives/repeat.js';

let nextId = 0;

class MyTodo extends LitElement {
    static get properties() {
        return {
            list: { 
                type: Array
            }
        };
    }

    static get styles() {
        return css`
        h1 {
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
        }
        `;
    }

    constructor() {
        super();
        this.list = [{ id: nextId++, text: 'my initial todo', checked: false }, { id: nextId++, text: 'Learn about Web Components', checked: true }];
    }

    render() {
        return html`
<h1>Todos WC</h1>
<section>
    <todo-input @submit=${this.addItem}></todo-input>
    <ul id="list-container">
        ${repeat(
            this.list,
            item => item.id,
            (item, index) => html`
                <todo-item 
                    .text="${item.text}" 
                    ?checked="${item.checked}" 
                    .index="${index}" 
                    @removed=${this.removeItem}
                    @checked=${this.toggleItem}>
                </todo-item>`)}
    </ul>
</section>`;
    }

    addItem(e) {
        this.list = [...this.list, { id: nextId++, text: e.detail, checked: false }];
    }

    removeItem(e) {
        this.list = [
            ...this.list.slice(0, e.detail),
            ...this.list.slice(e.detail + 1)
          ];
    }

    toggleItem(e) {
        const list = [...this.list];
        const item = list[e.detail];
        list[e.detail] = Object.assign({}, item, { checked: !item.checked });
        this.list = list;
    }
}

window.customElements.define('my-todo', MyTodo);
