import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DroneService, Drone, ScanResult, Position } from './drone.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public drones: Drone[];
  public inputX!: number;
  public inputY!: number;
  public scanResult?: ScanResult;
  public scanDrone?: Drone;
  public distanceToNearestTree: number;
  public nearestTreePos?: Position;

  constructor(public service: DroneService){
    this.drones = [];
    this.distanceToNearestTree = 0;
  }

  ngOnInit(): void {
    this.reloadDrones();
  }

  public activateDrone(drone: Drone): void {
    this.service.activateDrone(drone).subscribe();
    this.reloadDrones();
  }

  public shutdownDrone(drone: Drone): void {
    this.service.shutdownDrone(drone).subscribe();
    this.reloadDrones();
  }

  public flyToPositionAndScanArea(drone: Drone): void {
    this.service.flyToPosition(drone, this.inputX, this.inputY).subscribe(() => {
      this.reloadDrones();
      this.service.scanArea(drone).subscribe(item => {
        this.scanResult = item;
        this.getNearestTreeIndex(drone.position.x, drone.position.y);
      });


    } );
    this.inputX = 0;
    this.inputY = 0;
    this.scanDrone = drone;
  }

  public reloadDrones(): void {
    this.service.getDrones().subscribe(item => this.drones = item);
  }

  public examine(posX: number, posY: number, index: number, ) {
    this.service.markTreeAsExamined(posX,posY).subscribe(_ => {
        this.scanResult!.damagedTrees.splice(index,1);
        this.getNearestTreeIndex(this.scanDrone!.position.x, this.scanDrone!.position.y);
      });
  }

  public getNearestTreeIndex(dronePosX: number, dronePosY: number): number {
    this.distanceToNearestTree = Number.MAX_VALUE;
    let manhattenDistance: number;
    let nearestTreeIndex: number = -1;

    for (let index = 0; index < this.scanResult!.damagedTrees.length; index++) {
      const damagedTree = this.scanResult!.damagedTrees[index];
      manhattenDistance = Math.abs(dronePosX - damagedTree.x) + Math.abs(dronePosY - damagedTree.y);

      if (manhattenDistance < this.distanceToNearestTree) {
        this.distanceToNearestTree = manhattenDistance;
        nearestTreeIndex = index;
        this.nearestTreePos = {x: damagedTree.x, y: damagedTree.y };
      }
    }

    return nearestTreeIndex;
  }

  public isValidDistance(): boolean {
    return (this.distanceToNearestTree !== Number.MAX_VALUE);
  }
}
