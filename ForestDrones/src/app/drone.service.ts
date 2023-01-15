import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Drone {
  id: number;
  isActive: boolean;
  position: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface ScanResult {
  dronePosition: Position;
  damagedTrees: Position[];
}

@Injectable({
  providedIn: 'root',
})
export class DroneService {
  constructor(private http: HttpClient) {}

  public getDrones(): Observable<Drone[]> {
    return this.http.get<Drone[]>('http://localhost:5110/drones');
  }

  public activateDrone(drone: Drone): Observable<any> {
    return this.http.post(
      `http://localhost:5110/drones/${drone.id}/activate`,
      ''
    );
  }

  public shutdownDrone(drone: Drone): Observable<any> {
    return this.http.post(
      `http://localhost:5110/drones/${drone.id}/shutdown`,
      ''
    );
  }

  public flyToPosition(
    drone: Drone,
    posX: number,
    posY: number
  ): Observable<Position> {
    let body: Position = { x: posX, y: posY };
    return this.http.post<Position>(
      `http://localhost:5110/drones/${drone.id}/flyTo`,
      body
    );
  }

  public scanArea(drone: Drone): Observable<ScanResult> {
    return this.http.get<ScanResult>(
      `http://localhost:5110/drones/${drone.id}/scan`
    );
  }

  public markTreeAsExamined(posX: number, posY: number): Observable<Position> {
    let pos: Position = { x: posX, y: posY };
    return this.http.post<Position>(
      `http://localhost:5110/trees/markAsExamined`,
      pos
    );
  }
}
