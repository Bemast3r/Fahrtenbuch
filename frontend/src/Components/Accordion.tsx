import "./home.css"
import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { ReactComponent as ArrowIcon } from "./arrow.svg";

export declare interface AccordionProps {
    title?: string;
    show?: boolean;
    children?: React.ReactNode;
}

type State = {
    collapse: boolean;
    rotating: boolean;
};

type Action = { type: "collapse" } | { type: "show" } | { type: "rotate" };

function reducer(state: State, action: Action) {
    switch (action.type) {
        case "collapse":
            return {
                ...state,
                collapse: !state.collapse
            };
        case "show":
            return {
                ...state,
                collapse: true
            };
        case "rotate":
            return {
                ...state,
                rotating: !state.rotating
            };
        default:
            return state;
    }
}

export function Accordion({
    title = "Accordion Title",
    show = false,
    children
}: AccordionProps) {
    const accordionBodyRef = useRef<HTMLDivElement>(null);
    const [{ collapse, rotating }, dispatch] = useReducer(reducer, {
        collapse: show,
        rotating: false
    });

    const randomId = useRef(
        window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
    );

    useEffect(() => {
        if (show) dispatch({ type: "show" });
    }, [show]);

    return (
        <div className="card" style={{ marginBottom: "5px" }}>
            <h2 className="accordion-header" id={`heading-${randomId.current}`}>
                <Button
                    className={`accordion-button${collapse ? "" : " collapsed"}`}
                    type="button"
                    aria-expanded={collapse}
                    aria-controls={`collapse-${randomId.current}`}
                    onClick={() => {
                        dispatch({ type: "collapse" });
                        dispatch({ type: "rotate" });
                    }}
                // style={{backgroundColor: "red", borderColor: "red"}}
                >
                    {title}
                    <ArrowIcon
                        className={`accordion-icon${rotating ? " rotating" : ""}`}
                    />
                </Button>
            </h2>


            <div
                id={`collapse-${randomId.current}`}
                aria-labelledby={`heading-${randomId.current}`}
                className={`accordion-collapse`}
                style={
                    collapse
                        ? {
                            height: accordionBodyRef.current?.clientHeight,
                            transition: "height 0.2s ease",
                            overflow: "hidden"
                        }
                        : {
                            height: 0,
                            transition: "height 0.2s ease",
                            overflow: "hidden"
                        }
                }
            >
                <div className="accordion-body" ref={accordionBodyRef}>
                    {children || "Keine Fahrt oder ein Fehler."}
                </div>
            </div>
        </div>
    );
}
