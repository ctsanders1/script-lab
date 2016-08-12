import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Utilities} from '../shared/helpers';
import {ISnippet, ISnippetMeta, SnippetManager} from '../shared/services';
import {BaseComponent} from '../shared/components/base.component';

@Component({
    selector: 'new',
    templateUrl: 'new.component.html',
    styleUrls: ['new.component.scss']
})
export class NewComponent extends BaseComponent implements OnInit, OnDestroy {
    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _snippetManager: SnippetManager
    ) {
        super();
    }

    link: string;
    localGallery: any;
    gallery: any;
    importFlag = false;

    ngOnInit() {
        this._snippetManager.getLocal().then(data => this.localGallery = data);
        this._snippetManager.getPlaylist().then(data => this.gallery = data);
    }

    delete(snippet: ISnippet) {
        this._snippetManager.delete(snippet);
        this._snippetManager.getLocal().then(data => this.localGallery = data);
    }

    run(snippet: ISnippet) {
        this._router.navigate(['run', snippet.meta.id]);
    }

    select(snippet?: ISnippet) {
        if (Utilities.isEmpty(snippet)) {
            return this._snippetManager.new().then(newSnippet => {
                this._router.navigate(['edit', newSnippet.meta.id]);
            });
        }
        this._router.navigate(['edit', snippet.meta.id]);
    }

    duplicate(snippet: ISnippet) {
        this._snippetManager.duplicate(snippet)
            .then(snippet => this.select(snippet));
    }

    import(snippet?: ISnippetMeta) {
        var link = snippet.id || this.link;
        this._snippetManager.import(link).then(snippet => this.select(snippet));
    }
}