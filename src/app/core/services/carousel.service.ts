import { Injectable } from '@angular/core';

/**
 * Service for managing carousel state and navigation.
 * Provides keyboard navigation and accessibility features.
 */
@Injectable()
export class CarouselService {
    private _currentIndex = 0;
    private _totalItems = 0;

    /**
     * Initializes carousel with total number of items.
     * 
     * @param totalItems - Total number of carousel items
     */
    initialize(totalItems: number): void {
        this._totalItems = totalItems;
        this._currentIndex = 0;
    }

    /**
     * Gets current carousel index.
     * 
     * @returns Current index (0-based)
     */
    get currentIndex(): number {
        return this._currentIndex;
    }

    /**
     * Sets current carousel index with boundary checking.
     * 
     * @param index - Index to set
     */
    set currentIndex(index: number) {
        if (index >= 0 && index < this._totalItems) {
            this._currentIndex = index;
        }
    }

    /**
     * Navigates to next item if not at end.
     * 
     * @returns boolean - true if navigation occurred, false if at end
     */
    next(): boolean {
        if (this._currentIndex < this._totalItems - 1) {
            this._currentIndex++;
            return true;
        }
        return false;
    }

    /**
     * Navigates to previous item if not at start.
     * 
     * @returns boolean - true if navigation occurred, false if at start
     */
    previous(): boolean {
        if (this._currentIndex > 0) {
            this._currentIndex--;
            return true;
        }
        return false;
    }

    /**
     * Navigates to first item.
     */
    goToFirst(): void {
        this._currentIndex = 0;
    }

    /**
     * Navigates to last item.
     */
    goToLast(): void {
        this._currentIndex = this._totalItems - 1;
    }

    /**
     * Navigates to specific index.
     * 
     * @param index - Target index
     * @returns boolean - true if navigation occurred, false if invalid index
     */
    goTo(index: number): boolean {
        if (index >= 0 && index < this._totalItems) {
            this._currentIndex = index;
            return true;
        }
        return false;
    }

    /**
     * Checks if carousel is at the first item.
     * 
     * @returns boolean
     */
    isAtStart(): boolean {
        return this._currentIndex === 0;
    }

    /**
     * Checks if carousel is at the last item.
     * 
     * @returns boolean
     */
    isAtEnd(): boolean {
        return this._currentIndex === this._totalItems - 1;
    }

    /**
     * Resets carousel to initial state.
     */
    reset(): void {
        this._currentIndex = 0;
        this._totalItems = 0;
    }
}