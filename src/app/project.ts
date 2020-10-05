import { faAngular, faJs, faHtml5, faCss3, faPhp, faBootstrap } from '@fortawesome/free-brands-svg-icons';

export enum Technologies {
    HTML,
    CSS,
    SCSS,
    Sass,
    JS,
    TS,
    jQuery,
    pHp,
    Bootstrap,
    Firebase,
    Angular
}

export interface ProjectObject {
    name: string;
    caption: string;
    thumbnail: File | string; 
    color: String;
    description: string;
    images: Array<File> | Array<string>;
    technologies: Array<Technologies>;
    projectLink?: String;
    gitHubLink?: String;
}

export class Project {

    public projectObj: ProjectObject;
    
    constructor(private name: string, 
                private caption: string, 
                private thumbnail: File | string, 
                private color: String,
                private description: string, 
                private images: Array<any> | Array<string>,
                private technologies: Array<Technologies>,
                private projectLink?: String,
                private gitHubLink?: String) { 
        
        this.projectObj = { 
            name: this.name,
            caption: this.caption,
            thumbnail: this.thumbnail,
            color: this.color,
            description: this.description,
            images: this.images,
            technologies: this.technologies,
            projectLink: this.projectLink,
            gitHubLink: this.gitHubLink }

    }

    /**
     * Returns the name of the project
     * 
     * @returns String
     */
    public getName(): String {
        return this.name;
    }

    /**
     * Returns the caption of the project
     * 
     * @returns String
     */
    public getCaption(): String {
        return this.caption;
    }

    /**
     * Returns the thumbnail URL of the project
     * 
     * @returns URL as String
     */
    public getThumbnail(): File | String {
        return this.thumbnail;
    }

    /**
     * Returns the color of the project
     * 
     * @returns URL as String
     */
    public getColor(): String {
        return this.color;
    }


    /**
     * Returns the description of the project
     * 
     * @returns String
     */
    public getDescription(): String {
        return this.description;
    }

    /**
     * Returns the image URLs of the project
     * 
     * @returns URLs as an Array of Strings
     */
    public getImages(): Array<File | String> {
        return this.images;
    }

    /**
     * Returns the asscociated icon for the supplied enum
     * 
     * @param tech 
     *          enum
     */
    public getTechnologyIcon(tech: Technologies): any {
        let icon: any;

        switch(+tech) {
            case Technologies.HTML: {
                icon = faHtml5;
                break;
            }
            case Technologies.CSS: {
                icon = faCss3;
                break;
            }
            case Technologies.SCSS: {

                break;
            }
            case Technologies.Sass: {

                break;
            }
            case Technologies.JS: {
                icon = faJs;
                break;
            }
            case Technologies.TS: {

                break;
            }
            case Technologies.jQuery: {

                break;
            }
            case Technologies.Bootstrap: {
                icon = faBootstrap;
                break;
            }
            case Technologies.Firebase: {

                break;
            }
            case Technologies.pHp: {
                icon = faPhp;
                break;
            }
            case Technologies.Angular: {
                icon = faAngular;
                break;
            }
        }

        return icon;
    }

    /**
     * Returns the technology icons of the project
     * 
     * @returns Array of font awesome icons
     */
    public getTechnologyIcons(): Array<any> {

        var icons = [];

        if (this.technologies.length > 0) {
            this.technologies.forEach(tech => {
                icons.push(this.getTechnologyIcon(tech));
            })
        }

        return icons;
    }

    /**
     * Returns the project link of the project
     * 
     * @returns String
     */
    public getProjectLink(): String {
        return this.projectLink;
    }

    /**
     * Returns the git hub link of the project
     * 
     * @returns String
     */
    public getGithubLink(): String {
        return this.gitHubLink;
    }
    
}
