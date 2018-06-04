import { Directive, AfterViewInit, ViewContainerRef, Inject, Input,ElementRef, Renderer2,DebugElement } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * 
 * 
 * @export
 * @class StickyDirective
 */
@Directive({
  selector: '[sticky]'
})
export class StickyDirective {
  
  /**
   * Directive set options
   */
  directiveOptions = {

    pinToParent: false,
    scrollMainSelector:'app-root',
    parentOffset: 0,
    offsetTop:0,
    bindedElementOffset:0,
    stickyStartPoint:0

  }


  
/**
 * Observable fromEvent Listener
 */
scrolListener:Observable<any>;
  

  /**
   * Parent from stacked Element
   */
  pinnedTo:any;

  waypoint = { stickyStartsOn:null,scrollHeight:null,scrollTop:null,offsetTop:null,clientHeight:null,clientWidth:null,parentHeight:null,bindedElementHeight:null,stickyPushTop:null,offsetLeft:null};


  calledElement = [];
  
  elementOnTop:boolean;

  isBindedToAnotherElement:boolean;

  /**
  * Stick the element to Parent otherwise is pinned to document scroll
  */

  @Input('sticky') set getOnLoadData(data:string) {
      
    this.waypoint.offsetTop = this.el.nativeElement.offsetTop;
    this.waypoint.clientHeight = this.el.nativeElement.clientHeight;
    this.waypoint.clientWidth = this.el.nativeElement.clientWidth;
    console.log(this.el);
    this.isBindedToAnotherElement = false;

    
    

  }

  @Input('sticky-pin-to-parent') set pinToParent(pinActive:string) {

    if(pinActive == '' || pinActive == undefined ) {
        this.directiveOptions.pinToParent = true;
        console.log(this.renderer.parentNode(this.el.nativeElement).offsetTop);
        if(this.renderer.parentNode(this.el.nativeElement).offsetTop > 0) {
          this.waypoint.offsetTop = this.renderer.parentNode(this.el.nativeElement).offsetTop;
        }
    }
    else {
      this.directiveOptions.pinToParent = false ;
    }
  }

  @Input('sticky-offset-top') set offsetTop(offsetValue:any) {
     
    if(offsetValue) {
      this.waypoint.offsetTop = parseInt(offsetValue);
    }
  }  

  @Input('sticky-push-top') set pushTop(pushValue:any) {
     
    if(pushValue) {
      this.waypoint.stickyPushTop = parseInt(pushValue);
    }
  }

  @Input('sticky-bind-to') set bindToElement(element:string) {
     // TODO: Should check if attribute sticky is added 
     // TODO: Check if they have the same parrent
     // TODO: Change Comment Text
      let getAttributeNode = this.getQuerySelectorName(element).getAttributeNode('sticky');
      if(getAttributeNode !=null) {
        let elementsParent = this.renderer.parentNode(this.el.nativeElement)
        let bindedElementsParent = this.renderer.parentNode(this.getQuerySelectorName(element))
        
        if(elementsParent === bindedElementsParent) {
          // They have the same parent and can be binded
          
          let el = document.documentElement.getElementsByTagName(element);
          
          this.waypoint.bindedElementHeight = el[0]["offsetHeight"];
          this.waypoint.stickyStartsOn = el[0]["offsetTop"]; 
         
          this.waypoint.offsetTop = el[0]["offsetTop"]
          this.isBindedToAnotherElement = true;  

        }
        else {
          // They dont have the same paretn and can not binded 
          
          this.isBindedToAnotherElement = false;
        }

        
      }
      else {
        console.log("You can not bind this element");
      }
  }

  get elementOffset() {
    let elementOffset = this.waypoint.offsetTop + this.waypoint.bindedElementHeight;
    return elementOffset;
  }
  
  
  constructor( 
    @Inject(ViewContainerRef) private viewContainer: ViewContainerRef,
    @Inject(Renderer2) private renderer: Renderer2,

    private el:ElementRef
  ) { }
  
  
  
  ngAfterViewInit() {

    // FIXME: Make it Better looks Odd
    // TODO: You should check the siblings 
    // TODO: ıf the elements siblings has the sticky attribute then you should add extra offset to the sibling element
    
   
    this.addParentStyleFix(this.getParentElement(this.el.nativeElement));
    
    //this.directiveOptions.parentOffset = this.el.nativeElement.offsetParent.offsetTop;

    this.scrolListener = Observable.fromEvent(this.getQuerySelectorName(this.directiveOptions.scrollMainSelector),"scroll").map(e => {return e });
    this.scrolListener.subscribe(scrollEventResult => {
       this.waypoint.scrollTop = scrollEventResult['srcElement']['scrollTop'];
       this.waypoint.scrollHeight = scrollEventResult['srcElement']['scrollHeight'];
      

       if(this.waypoint.scrollTop > this.elementOffset) {
        

         this.renderer.setStyle(this.el.nativeElement,'position','fixed');
         this.renderer.setStyle(this.el.nativeElement,'max-width',`${this.waypoint.clientWidth}px`);
         this.renderer.setStyle(this.el.nativeElement,'top',"0");
         this.renderer.setStyle(this.el.nativeElement,'width',"100%");
       }

       if(this.waypoint.scrollTop< this.waypoint.offsetTop) {
         this.renderer.removeStyle(this.el.nativeElement,'position');
         this.renderer.removeStyle(this.el.nativeElement,'max-width');
         this.renderer.removeStyle(this.el.nativeElement,'top');
       }
       


    })
    
  }
 
  /**
   * Get Ele 
   * 
   */
  getQuerySelectorName(elementTagName:string) {
    const tagNameSelector = document.getElementsByTagName(elementTagName);
    return document.querySelector(tagNameSelector[0]['nodeName']);     
  }

  callThis(e) {
    return this.calledElement.push(e);
  }




  /** 
  * Get Parent Element Node
  */
  getParentElement(element:Element) {
    return this.renderer.parentNode(element);
  }

  setInlineStyle(rendererElement:Element,style:string,value:string) {
    this.renderer.setStyle(rendererElement,style,value);
  }

  removeInlineStyle(rendererElement:Element,style:string) {
    this.renderer.removeStyle(rendererElement,style);
  }

  
/**
 * Add the sticky styles to nativeElement
 * 
 */
addStickyStyles(nativeElement:Element,isPinned:{element:boolean,top:number}) {
    console.log(isPinned.top.toString());
    if(!isPinned.element)
    {
    this.setInlineStyle(nativeElement,'position','fixed'); 
    }
    else {
      this.setInlineStyle(nativeElement,'position','absolute'); 
      this.setInlineStyle(nativeElement,'top',`${isPinned.top.toString()}px`); 
    }
  }

addParentStyleFix(element?:Element) {
  this.setInlineStyle(this.getQuerySelectorName(this.directiveOptions.scrollMainSelector),'height','100vh');
  this.setInlineStyle(this.getQuerySelectorName(this.directiveOptions.scrollMainSelector),'overflow','auto');
  this.setInlineStyle(this.getQuerySelectorName(this.directiveOptions.scrollMainSelector),'display','block'); 
  
}

removeStickyStyles(nativeElement:Element) {
    this.removeInlineStyle(nativeElement,'position');
    this.removeInlineStyle(nativeElement,'width');
}
  

}
