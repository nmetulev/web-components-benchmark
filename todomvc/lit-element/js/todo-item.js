import { LitElement, html, css } from '../node_modules/lit-element/lit-element.js';

class TodoItem extends LitElement {
    static get properties() {
        return {
            checked: {
                type: Boolean,
            },
            index: {
                type: Number
            },
            text: {}
        };
    }

    static get styles() {
        return css`
        :host {
            display: block;
        }
    
        li.item {
            font-size: 24px;
            display: block;
            position: relative;
            border-bottom: 1px solid #ededed;
        }
    
        li.item input {
            text-align: center;
            width: 40px;
            /* auto, since non-WebKit browsers doesn't support input styling */
            height: auto;
            position: absolute;
            top: 9px;
            bottom: 0;
            margin: auto 0;
            border: none;
            /* Mobile Safari */
            -webkit-appearance: none;
            appearance: none;
        }
    
        li.item input:after {
            content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');
        }
    
        li.item input:checked:after {
            content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
        }
    
        li.item label {
            white-space: pre;
            word-break: break-word;
            padding: 15px 60px 15px 15px;
            margin-left: 45px;
            display: block;
            line-height: 1.2;
            transition: color 0.4s;
        }
    
        li.item.completed label {
            color: #d9d9d9;
            text-decoration: line-through;
        }
    
        li.item button,
            li.item input[type="checkbox"] {
            outline: none;
        }
    
        li.item button {
            margin: 0;
            padding: 0;
            border: 0;
            background: none;
            font-size: 100%;
            vertical-align: baseline;
            font-family: inherit;
            font-weight: inherit;
            color: inherit;
            -webkit-appearance: none;
            appearance: none;
            -webkit-font-smoothing: antialiased;
            -moz-font-smoothing: antialiased;
            font-smoothing: antialiased;
        }
    
        li.item .destroy {
            position: absolute;
            top: 0;
            right: 10px;
            bottom: 0;
            width: 40px;
            height: 40px;
            margin: auto 0;
            font-size: 30px;
            color: #cc9a9a;
            margin-bottom: 11px;
            transition: color 0.2s ease-out;
        }
    
        li.item .destroy:hover {
            color: #af5b5e;
        }`;
    }

    constructor() {
        super();
        this.checked = false;
        this.text = '';
        this.index = 0;
    }

    render() {
        const {checked, text} = this;
        return html`
<li class="item ${checked ? 'completed' : ''}">
    <input type="checkbox" .checked=${checked} @change=${this.handleOnChecked}>
    <label>${text}</label>
    <button class="destroy" @click=${this.handleOnRemoved}>x</button>
</li>`;
    }

    handleOnRemoved(e) {
        this.dispatchEvent(new CustomEvent('removed', { detail: this.index }));
    }

    handleOnChecked(e) {
        this.dispatchEvent(new CustomEvent('checked', { detail: this.index }));
    }
}

window.customElements.define('todo-item', TodoItem);
